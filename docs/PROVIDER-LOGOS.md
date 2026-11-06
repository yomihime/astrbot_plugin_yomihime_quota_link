# 供应商图标来源与覆盖

核对日期：2026-11-06。本文覆盖 17 个原生预设、旧 Grsai 配置及 GLM 地区分支。当前随包提供 14 份主资源，包括通用接口符号；StepFun、MiniMax Token Plan、xAI 和中国站 GLM 仍使用通用符号，不能宣称所有品牌图标均已补齐或获得官方授权。

## 来源与权利

核对依据是供应商官网、官方品牌页或官方项目仓库。采用的资源分为官方仓库图形整理、Lobe Icons 社区矢量、既有官网图片矢量整理、用户确认头像和本项目通用符号。社区版本可识别，不等于官方原始文件，也不保证像素、路径或渐变一致。

只使用一个图标资源库 Lobe Icons。新增社区文件固定于 [`ea434b96e75813517b377825e01c0df61dee8836`](https://github.com/lobehub/lobe-icons/tree/ea434b96e75813517b377825e01c0df61dee8836)，既有百炼保留历史版本。其 [MIT 许可](https://github.com/lobehub/lobe-icons/blob/ea434b96e75813517b377825e01c0df61dee8836/LICENSE)覆盖 Lobe 提供的材料，要求保留版权和许可声明；它不授予供应商品牌或商标权，不证明品牌所有者批准社区重绘。官方软件的 MIT、AGPL、LGPL 同样不能单独证明商标使用获准或所有图形有独立开放许可。

图形与商标属于相应权利人。展示用于识别配置的服务或适配器类型，不表示合作、赞助、背书或任意自托管站点的所有权。官方使用条件仍适用；未找到独立许可不表示免费授权。

## 实际选择

下表资源名对应 `quota_link/presentation/assets/provider_logos/svg/` 的 SVG 与 `png-128/` 的同名 PNG。`manifest.json` 记录分类、上游源与派生文件 SHA-256；运行时映射见 `provider_logos.py`。

| 预设 / 分支 | 资源 | 来源分类、核对结果与限制 |
| --- | --- | --- |
| DeepSeek `deepseek` | `deepseek` | 保留官方仓库鲸鱼路径整理版，去除字标、保留蓝色与比例；不是本轮新获品牌许可。 |
| 阿里云百炼 `alibaba_bailian` | `alibaba_bailian` | 保留既有 Lobe 彩色几何标记；百炼平台不能以 Qwen 模型标记替代。 |
| Grsai `grsai` | `grsai` | 保留官网 PNG 的三块几何图形矢量整理版，方向构图相符；手工路径及近黑色不等于原始像素。 |
| Meinianda `meinianda` | `meinianda` | 保留用户确认的女孩头像矢量近似，棕发、格纹衣与饮料盒细节为近似；不换成软件默认标记，不主张新取得头像许可。 |
| OpenAI 兼容接口 `openai_compatible` | `openai_compatible` | 本项目通用 `</>` 接口符号，不代表 OpenAI 运营该站点。 |
| Moonshot `moonshot` | `moonshot` | Lobe 单色条纹球体，与官方 favicon 对照相符；保持公司身份，不自动替换成 Kimi 产品标记。 |
| StepFun `stepfun` | `openai_compatible` | 待品牌许可条件解决；官方平台协议有品牌展示许可要求，本轮未取得这类许可。 |
| OpenRouter `openrouter` | `openrouter` | Lobe 新几何 OR，与官方 2026 年更新方向一致；不再使用旧分叉箭头。官方下载受限，未证明路径完全相同。 |
| Novita AI `novita` | `novita` | Lobe 黑色角形 N，与官方黑白标记可识别一致，但内部连接处略有差异；不采用缺少当前官方配色依据的绿色版。 |
| xAI `xai` | `openai_compatible` | 待核实现行公司身份；官方页面使用 SpaceXSI / SpaceX Super Intelligence，包名为 SpaceXAI，不能将历史 xAI 或 Grok 产品标记默认为当前公司图标。 |
| Venice `venice` | `venice` | Lobe 黑色交叉钥匙，对应官方紧凑标记；官方包读取失败，精确路径一致性未核实。 |
| Vercel AI Gateway `vercel_gateway` | `vercel_gateway` | Lobe 黑色向上三角形，与官方 Vercel 几何一致至坐标舍入；仍保留 Gateway 名称，不替换为 AI SDK 标记。 |
| Pollinations `pollinations` | `pollinations` | 官方仓库当前花蜂图形，保留上游 MIT；不使用不同图形的旧 Lobe 版。单色源与官网金色 favicon 身份一致，不主张配色相同。 |
| MiniMax Token Plan `minimax_plan` | `openai_compatible` | 待品牌使用条件解决；官方协议索引有书面同意要求，当前完整重定向条文读取有限，本轮未取得同意。 |
| GLM Coding Plan 中国站 `glm_plan` | `openai_compatible` | 当前官方新六角星 favicon 与旧 Lobe 智谱点阵不同，尚无核实可采用的现行授权资源。 |
| New API `new_api` | `new_api` | Lobe 彩色双月牙及四角星社区版；较官方 PNG 星角更锐、饱和度和透明留白不同，表示网关软件适配器。 |
| Sub2API `sub2api` | `sub2api` | Lobe 透明交错 S 社区变体；官方完整图标有深色圆角底、阴影和不同渐变，不能称为未修改官方原件。 |
| GLM 国际站 `glm_plan` + `region=global` | `glm_plan_global` | Lobe Z.AI 单色角形 Z，与国际站官方图形对照；不与中国站共用品牌。 |
| 旧 `openai_compatible` + `service_profile=grsai` | `grsai` | 保留 Grsai 特例，不能被通用映射覆盖。 |

GLM 按显式 `region` 选择，缺省为中国站；不根据账户名称、语言或可编辑 URL 猜测品牌。New API、Sub2API 标记只识别适配器软件，不声明任意配置站点由上游运营。

## 采用资源的准确上游地址

新增 Lobe 文件均来自同一固定提交。旧五份主资源保留原字节；下表不把本地派生文件称为上游原件。

| 资源 | 选用来源 |
| --- | --- |
| DeepSeek | [官方固定 SVG](https://raw.githubusercontent.com/deepseek-ai/DeepSeek-LLM/f8b3d77beb4449d77932eccc6abe08826ad3c608/images/logo.svg)中的鲸鱼路径；既有软件许可参考 `licenses/DeepSeek-LICENSE-CODE.txt`。 |
| 百炼 | [Lobe 历史 bailian-color.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/617448c949ee9620abd9cf989a33a544aa0391ef/packages/static-svg/icons/bailian-color.svg)。 |
| Grsai | [官网 logo.png](https://grsai.ai/images/logo.png)的既有矢量整理；未找到独立开放图形许可。 |
| Meinianda | 用户提供并确认的参考头像，静态矢量近似；无公开源 URL，不把用户确认解释为第三方权利授权。 |
| 通用接口 | 本项目绘制的静态接口符号。 |
| Moonshot | [moonshot.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/moonshot.svg)。 |
| OpenRouter | [openrouter.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/openrouter.svg)。 |
| Novita | [novita.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/novita.svg)。 |
| Venice | [venice.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/venice.svg)。 |
| Vercel AI Gateway | [vercel.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/vercel.svg)。 |
| Pollinations | [官方固定 SVG](https://raw.githubusercontent.com/pollinations/pollinations/8f369ab561838b4b8a7a3de4e34b1ef528436b6f/enter.pollinations.ai/frontend/public/brand-logos/pollinations.svg)；[同版本 MIT](https://raw.githubusercontent.com/pollinations/pollinations/8f369ab561838b4b8a7a3de4e34b1ef528436b6f/LICENSE)保留于 `licenses/Pollinations-LICENSE.txt`。 |
| New API | [newapi-color.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/newapi-color.svg)。 |
| Sub2API | [sub2api-color.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/sub2api-color.svg)。 |
| GLM 国际站 | [zai.svg](https://raw.githubusercontent.com/lobehub/lobe-icons/ea434b96e75813517b377825e01c0df61dee8836/packages/static-svg/icons/zai.svg)。 |

## 官方依据与使用条件

- **DeepSeek / 百炼：**[DeepSeek 官网](https://www.deepseek.com/)、上述官方仓库和[百炼产品页](https://www.aliyun.com/product/bailian)用于识别平台。未确认独立商标授权，软件许可参考不扩大为品牌许可。
- **Grsai / Meinianda：**[Grsai 官网](https://grsai.ai/)使用三块图形。[Meinianda 官网](https://meinianda.top/)的[公开图片](https://meinianda.top/logo.png)是 New API 软件默认 motif，不能据此覆盖用户确认头像或推断站点独立图形权利。
- **Moonshot：**[公司官网](https://www.moonshot.cn/)和[官方 favicon](https://statics.kimi.ai/moonshot-ai/favicon.ico)核对条纹球体。[Kimi 品牌页](https://www.kimi.com/resources/kimi-brand)及[标识条款](https://www.kimi.com/zh-cn/policies/logo-usage-terms)属于相关产品品牌依据，含用途、改动和背书限制，不是无限制授权。
- **StepFun：**[官方仓库图形](https://raw.githubusercontent.com/stepfun-ai/Step-5-Preview/main/assets/stepfun-logo.png)提供圆形阶梯标记依据；[平台用户协议](https://platform.stepfun.com/legal/user-agreement.html)第 5.5 条有品牌展示许可条件，故继续通用符号。
- **OpenRouter：**[品牌页](https://openrouter.ai/brand)和[2026 品牌更新](https://openrouter.ai/blog/announcements/brand-refresh/)确认新 OR；[官方 Ink glyph](https://openrouter.ai/brand/logos/transparent/glyph/svg/glyph-ink.svg)是比较入口。官方要求不拉伸、不改色、不混改；直接资源读取受 403 限制，未宣称社区文件就是官方原件。
- **Novita：**[compact SVG](https://novita.ai/logo/logo_small.svg)、[黑色字标](https://novita.ai/logo/logo.svg)及[白色字标](https://novita.ai/logo/white-logo.svg)确认黑白角形 N。[服务条款](https://novita.ai/legal/terms-of-service)保留内容和标识权利；社区内连接处微差仍是比较限制。
- **xAI：**[品牌政策](https://x.ai/legal/brand-guidelines)和[API 概览](https://docs.x.ai/overview)当前使用 SpaceXSI 名称；[现行资源包](https://data.x.ai/logos/SpaceXAI_Grok_Assets.zip)读取返回 403。政策要求准确指代、不得暗示背书、使用提供的原图且不修改；当前公司图形尚未核实，继续通用符号。
- **Venice：**[品牌页](https://venice.ai/brand)和[钥匙包](https://venice.ai/brand/venice-keys-svg.zip)确认紧凑交叉钥匙。logo 只能为 Deep Blue、Off White、白或黑，强调蓝不是 logo 色；保持透明度、比例与留白。资源包读取失败，未作精确路径等同声明。
- **Vercel：**[Gateway 产品页](https://vercel.com/ai-gateway)、[品牌规范](https://vercel.com/geist/brands)与[官方三角 SVG](https://vercel.com/geist/brands/assets/vercel-symbol-black.svg)确认公司身份。有限空间或多品牌符号场景可用三角；要求真实描述，禁止变形、误导关系，其他用途可能需书面许可，并要求下方商标声明。
- **Pollinations：**[官网](https://pollinations.ai/)、[金色 favicon](https://pollinations.ai/favicon-32x32.png)及固定官方仓库 SVG 确认花蜂形。使用仓库 MIT 材料并保留声明，不将其描述为商标授权。
- **MiniMax：**[公司站](https://www.minimax.cn/)、[M Plan](https://www.minimax.cn/m-plan)及[官方仓库公司图形](https://raw.githubusercontent.com/MiniMax-AI/MiniMax-M1/main/figures/MiniMaxLogo-Light.png)区分波形公司标记和产品吉祥物。[平台协议](https://platform.minimax.cn/protocol/user-agreement)索引中的书面同意条件尚未解决，完整当前条文读取有限，继续通用符号。
- **GLM：**[中国站计划页](https://docs.bigmodel.cn/cn/coding-plan/overview)的[当前 favicon](https://docs.bigmodel.cn/mintlify-assets/_mintlify/favicons/zhipu-ef7018ed/uX_6lYCPLvdOcSdM/_generated/favicon/android-chrome-192x192.png)为新六角星，与旧点阵不同；[国际站计划页](https://docs.z.ai/devpack/overview)和[官方 Z.AI SVG](https://z-cdn.chatglm.cn/z-ai/static/logo.svg)用于对照国际标记。分别核对地区，没有确认独立官方商标授权。
- **New API / Sub2API：**[New API 官方站](https://www.newapi.ai/)、[固定官方 PNG](https://raw.githubusercontent.com/QuantumNous/new-api/2de51a19e35a602a0041d380b29be7c9bcd1e0e5/web/public/logo.png)和[Sub2API 固定官方 SVG](https://raw.githubusercontent.com/Wei-Shaw/sub2api/c5ca149a3d856d92fa0b61bea276338be718c5db/assets/logo.svg)核对项目身份。采用 Lobe 社区版本，上游 AGPL/LGPL 不被标为图形 MIT 或商标许可；任意自托管站点的运营者与软件品牌分开。

Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.

## 派生与运行时

静态 SVG 离线等比适配并栅格化为透明 128×128 RGBA PNG；原有五份资源保持原字节。社区变体按实际源记录，不以统一外观掩盖图形差异。离线设计工具不是插件运行依赖。

卡片使用固定哈希校验的 PNG，管理页使用相同 PNG 的内嵌数据 URI，固定容器等比显示。运行时不下载品牌图像、不解析 SVG、不从用户路径或 URL 取图。已知未解决项使用通用接口符号；未知键、缺失、损坏或解码失败保留对应降级显示。字节哈希证明随包完整性，不证明品牌授权或与官方像素完全相同。
