# YQL 供应商图标 · 来源与派生

本目录随插件包提供源 SVG、128×128 透明 PNG 派生、来源清单与许可文本。查询与状态卡片以 40px 显示已校验的 PNG；运行时无 SVG 解析器、远程加载或新增依赖。

| 配置值 | 源文件 | 来源 |
|---|---|---|
| `deepseek` | `svg/deepseek.svg` | [DeepSeek 官方仓库固定版本](https://github.com/deepseek-ai/DeepSeek-LLM/blob/f8b3d77beb4449d77932eccc6abe08826ad3c608/images/logo.svg)的鲸鱼路径；移除字标，保留比例与蓝色。仓库 MIT / LICENSE-CODE 见 `licenses/DeepSeek-LICENSE-CODE.txt`。 |
| `alibaba_bailian` | `svg/alibaba_bailian.svg` | [Lobe Icons 固定版本](https://github.com/lobehub/lobe-icons/blob/617448c949ee9620abd9cf989a33a544aa0391ef/packages/static-svg/icons/bailian-color.svg)的百炼彩图；保留路径与配色。MIT 许可见 `licenses/Lobe-Icons-LICENSE.txt`。 |
| `grsai` | `svg/grsai.svg` | 按 [Grsai 官网 PNG](https://grsai.ai/images/logo.png)的三个几何区域矢量整理，保留方向和分割。额外 `grsai-dark.svg` 为反白主题派生；当前暖纸卡片使用深色主版。 |
| `meinianda` | `svg/meinianda.svg` | 用户提供并确认的女孩头像手工矢量复刻：棕发、蓝灰格纹衣、吸管与美年达饮料盒。艺术字和细节由静态路径近似；使用用户确认版本，旧 New API 图形已替换。 |
| `openai_compatible` | `svg/openai_compatible.svg` | 本项目的通用 `</>` 接口符号，用于任意 OpenAI 兼容服务。 |

## 离线派生与验证

- 每个 `png-128/<名称>.png` 从同名 SVG 离线渲染为 128×128 RGBA。设计工具使用 Sharp/libvips 的 `sharp(svg).resize(128,128).png()`；此工具不属于插件运行依赖。
- PNG 经 Pillow 等比缩为 40×40。源 SHA-256 与 PNG SHA-256 记录在 `manifest.json`；运行时固定 PNG 哈希在 `provider_logos.py`，未知键、缺失或损坏文件恢复原卡片。
- Meinianda SVG 为 `viewBox="0 0 84 84"`，其它图标为 `0 0 32 32`。所有图标背景透明，图案自身保持配色。
- SVG 只含静态矢量与文件内裁切引用，沿用静态路径；没有脚本、外链、字体或嵌入位图。
- 来源图形和品牌权利归相应权利人。这里标明实际整理/复刻来源，不表示官方合作或背书；上游许可文本保持原文。
