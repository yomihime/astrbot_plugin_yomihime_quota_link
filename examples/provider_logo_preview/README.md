# 供应商图标 · 合成卡片演示

此脚本使用生产查询/状态 builder 和默认加载内置图标的 renderer。图标槽位为 40×40 px；输入全部为合成数据，演示字样只在脚本中添加。

```sh
python examples/provider_logo_preview/render.py --font <已校验字体路径> --output /tmp/provider-card-previews
```

输出五种供应商查询卡、多账户本地状态卡和 Meinianda 单账户详情卡。完整源 SVG、固定 PNG 派生、校验清单及许可位于 `quota_link/presentation/assets/provider_logos/`，随生产包分发。字体继续使用独立管理缓存，插件包不捆绑字体。

缺失或坏图标恢复原卡片标题与内容。该脚本的三张输出与用户已确认的本地预览逐字节一致。
