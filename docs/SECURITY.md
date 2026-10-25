# 安全存储、原生页面与迁移

## 范围与威胁模型

本实现降低普通配置、插件 API 回显、日志及随手扫描 JSON 时暴露凭据的风险。它不能防御拥有同一操作系统用户任意文件读取/代码执行权限的 AI 或恶意程序：托管主密钥和密文均由 AstrBot 用户访问，进程内查询仍需明文。环境变量也不是对同用户进程的绝对隔离。请在 AI 文件/命令工具层限制数据目录和进程环境访问。

`secret: true` 只是宿主密码输入显示标记，不是加密。旧字段在 `_conf_schema.json` 中隐藏保留是升级防丢措施，不表示旧凭据已经安全迁移。

## 存储与密钥

所有持久化数据位于 `StarTools.get_data_dir("astrbot_plugin_yomihime_quota_link")` 返回的插件数据目录：

- `config/accounts.json`：Quota 专属 schema、修订号、非秘密配置、环境引用、独立密文引用、迁移清理指纹。
- `secrets/quota_secret_*.blob`：AES-256-GCM 随机 nonce 密文；内部认证引用绑定，复制到不同引用不可读取。
- `state/config-published.marker`：不可变的配置发布历史标记，丢失 manifest 时阻止重新启用残留旧明文。
- `keys/master.key`、`keys/selection.json`：私有托管主密钥及固定选择记录。已有选择不自动轮换或重置。

可在首次使用前设置 `QUOTA_LINK_SECRET_KEY`，值为严格 Base64 编码的 32 字节随机主密钥。缺失或错误的已选环境密钥、显式空值、错误格式、错误密钥、丢失密钥或损坏密文均失败关闭。已存在密文或持久引用时绝不自动生成替代密钥。不要把 Game Link 的密钥、文件或真实凭据复制到 Quota；两者 namespace、AAD、引用和 schema 独立。

备份必须同时保留配置、密文以及对应密钥/外部密钥来源，并保护备份访问权限。仅恢复配置或仅恢复密文不能恢复凭据。当前不提供主密钥重置/轮换按钮；丢失后应先恢复匹配备份，不要删除密钥文件试图“修复”。

POSIX 新目录 0700、新文件 0600，拒绝不安全已有目录权限、链接、特殊文件及硬链接。程序不修复现有权限、不改变用户机器 ACL。Windows 保留 Game Link 的 native handle/no-reparse/ACL 实现与资格 gate：本地 NTFS，Windows build 26200/26300，x64 CPython 3.12.10、3.12.14 或 3.13.9（GIL enabled）。不满足条件或原有目录 ACL 不安全即拒绝安全存储。Linux 上的合成 Windows ACL 测试不是原生 Windows I/O 实测，也不声称支持所有 Windows/Python 组合。

## 管理边界

管理页位于 `pages/00-quota-link/index.html`，使用宿主原生插件桥。路由只接受同源、已认证的真实 Dashboard 请求，调用实际绑定的 `DashboardServer._validate_dashboard_token`，检查真实请求上下文与用户；不读取宿主 JWT 密钥、不自建 JWT、不接受 API key/页面资源令牌绕过。等待后及提交边界再次验证会话，关闭/替换插件路由会使旧代次失效。

所有详情和凭据操作经独立白名单 POST 路由；body 限制 64 KiB，拒绝重复字段、非有限数、额外字段与未知操作。宿主 4.29.1 的兼容适配器会先缓冲 HTTP body，因此这里限制的是插件解析/处理，不承诺能限制整个宿主的接收内存。

普通保存不能提交 `auth`、嵌套凭据字段或 `${...}` 模板；凭据只能单独替换或清除，状态 DTO 只有 `configured` 和 `source`，不会返回值、环境变量值或密文引用。已有账户的供应商类型按解析后的 canonical type 固定，不能利用模板标签重绑既有凭据。所有更新都需匹配修订号；并发写在单个插件实例内串行，原子 manifest 发布。该设计不支持多个 AstrBot 进程同时写同一插件数据目录。

浏览器不持久保存凭据草稿；导航、取消、鉴权丢失及请求代次改变会清理。请求结果未知时不得自动重试写操作，须刷新核对状态/修订号。保存后更换查询运行时，取消旧查询、关闭旧客户端、清理缓存；旧配置不覆盖迁移后的保险库。

## 显式旧配置迁移

1. 升级保留全部旧 provider 模板和字段但隐藏它们。AstrBot 4.29.1 在插件初始化前按 schema 删除未知字段并保存，故不能直接删掉旧 schema。
2. 页面只提供去凭据预览和数量，迁移计划绑定当前源与修订号，用户必须明确确认。
3. 加密每个普通凭据并原子发布引用，`${ENV_VAR}` 保留为引用，不解析后复制成密文。
4. 只有加密 manifest 已持久化，才尝试将旧宿主字段恢复为默认空值并保存。失败时保留原数据并显示 `cleanup_pending`。重试只清理同一个已导入源，不重新覆盖保险库。
5. 已迁移后出现不同旧源，显示 `legacy_conflict`，不自动导入或删除。恢复/手动整理必须先核对来源。

错误配置、嵌入普通字段的凭据、写入失败均不会删除原数据。初次迁移发布失败可在同一插件实例内重新确认；如果重启后存在发布历史/密文却缺失 manifest，将失败关闭，须先核对并恢复匹配备份，而不是把残留旧明文当新配置激活。中断在密文写入但 manifest 发布前可能留有无引用密文；它不是明文，保留以避免误删。替换/清除/移除账户成功后会尽力删除已无引用的旧密文；删除失败不会撤销成功配置或恢复旧凭据。磁盘备份、文件历史或外部副本不在此清理范围内。

## 来源与兼容验证

移植来源：[Game Link cf755ed4ac455e8be48a9b99c285078cdb696510](https://github.com/yomihime/astrbot_plugin_yomihime_game_link/tree/cf755ed4ac455e8be48a9b99c285078cdb696510)。两项目均 AGPL-3.0；保留源文件注释与许可证，前端依赖许可证随生产资源打包。

- `infrastructure/secret_codec.py`、`key_provider.py`、`managed_key_file.py`、`windows/*`：真实实现的移植/适配。
- `managed_key_manager.py`、`secret_store.py`：保留已证明空库初始化、独立密文引用和不自动重建密钥原则，抽取 Quota 所需最小文件存储；不移植模块 SDK、业务运行时、SQLite 全框架或 Game Link 数据。
- `adapters/astrbot/web_admin.py`、`admin_pages.py`：移植宿主 verifier 与请求 fence 逻辑。
- `pages/frontend/src/ui/*`、shell/tokens/confirmation：复用 Oil Vue/Naive UI 组件和视觉语言，Quota 页面仅承载额度配置。

宿主验证基准：[AstrBot 4.29.1 / dffe922773725e9c178392c423676ad65044748c](https://github.com/AstrBotDevs/AstrBot/tree/dffe922773725e9c178392c423676ad65044748c)。最低版本为 4.29.1；`<5` 是安装范围，不代表未来每个 4.x 版本均验证。契约变化时拒绝访问，不使用不安全兼容降级。测试包含真实固定版本宿主源码的 verifier/中间件/插件 API 调度契约及原始配置 normalization 方法。真实运行中的用户 Host 未安装或测试此分支；生产 bundle 的 jsdom DOM/状态测试采用合成桥和合成凭据，不冒充真实浏览器或部署验证。随后已在实际云端 Chromium、同机合成宿主桥上检查五种供应商明暗概览、完整编辑表单、通用高级映射与 390px 明暗概览，未见重叠或移动概览横向溢出。该视觉检查不等于真实 Host 部署、真实凭据或完整浏览器交互验收；原生 Windows I/O 仍未实测。
