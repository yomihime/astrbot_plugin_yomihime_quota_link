# 开发指南

## 环境

建议使用 Python 3.12 或更高版本，并在 AstrBot 的运行环境中调试插件。

运行时依赖与 AstrBot 安装要求沿用 Game Link 的最低版本策略。新增上限或排除版本时，请附上可复现的不兼容行为与上游问题，并更新 `tests/test_dependencies.py` 的例外记录。前端构建锁文件、测试夹具和工具版本继续按可复现构建需求维护。

```bash
git clone https://github.com/yomihime/astrbot_plugin_yomihime_quota_link
cd astrbot_plugin_yomihime_quota_link
```

## 代码约定

- 插件入口固定为 `main.py`。
- 插件元数据维护在 `metadata.yaml`。
- 持久化数据写入 AstrBot `data` 目录，不写入源码目录。
- 网络请求使用异步库，不使用阻塞式 `requests`。
- 平台适配器应隔离失败状态，不让单个平台故障影响其他平台。
- 不在仓库中提交 API Key、Cookie、访问令牌或本地配置。

## 检查

```bash
ruff check .
ruff format --check .
python -m pytest -q
cd pages/frontend
npm ci
npm run typecheck
npm test
npm run build
```

卡片回归需要完整的固定 Noto 字体：将 `QUOTA_TEST_FONT` 指向已通过大小与 SHA256 校验的 `NotoSansCJKsc-Regular.otf`，设置 `QUOTA_REQUIRE_TEST_FONT=1` 后运行测试。字体常量见 `quota_link/presentation/font.py`；CI 使用现有固定来源和校验流程准备独立夹具，准备失败会阻止通过。依赖矩阵在 Python 3.12 下覆盖 Pillow 10.0.0、12.3.0 和宿主固定 13.0.0；最低组合同时覆盖 httpx 0.28.0、cryptography 46.0.3。`tests/fixtures/host-pillow13.txt` 只记录本次安装冲突涉及的宿主保护项。

新增平台适配器或监控逻辑时，请同时补充对应的测试和 README 文档。

安全存储与管理页的移植来源、宿主契约和验证限制见 `docs/SECURITY.md`。只用合成凭据测试；禁止用测试脚本迁移真实实例。原生 Windows I/O 与真实宿主部署需要分别验证，不可由 Linux 单测替代。

## 真实宿主预警回归

修复预警配置、命令或消息路径时，使用 [`scripts/real_host_regression`](scripts/real_host_regression/README.md) 将最终候选 ZIP 安装到独立官方 AstrBot 4.29.1 中复验。脚本覆盖真实网页 API、事件总线、定时任务、模型与人格路由及 OneBot 组件转换；外部供应商、模型响应和 QQ 网络发送采用合成替身。候选到期使用真实时间等待，运行目录必须全新。这个可选集成步骤与默认离线单测分开，须记录实际运行结果。
