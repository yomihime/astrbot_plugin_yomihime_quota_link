# 开发指南

## 环境

建议使用 Python 3.12 或更高版本，并在 AstrBot 的运行环境中调试插件。

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
```

新增平台适配器或监控逻辑时，请同时补充对应的测试和 README 文档。
