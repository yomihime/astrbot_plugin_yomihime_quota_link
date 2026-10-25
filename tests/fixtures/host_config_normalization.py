"""Pinned AstrBot normalization methods used by synthetic upgrade tests.

Source: https://github.com/AstrBotDevs/AstrBot/blob/
  dffe922773725e9c178392c423676ad65044748c/
  astrbot/core/config/astrbot_config.py
AstrBot version: 4.29.1. Upstream license: AGPL-3.0.
Source-file SHA-256: 3a3223bbbc2212e856a48e11a5d0c755bafd8b5c375b87f30f847d826ff3af7a

The two methods below are copied verbatim, including their comments. No host
package is imported and no dashboard, network, or real config is touched.
DEFAULT_VALUE_MAP is only a supported-type sentinel: the tested plugin schema
supplies explicit defaults for every non-object node. Object fallback values are
not used by these upstream methods. This is not a substitute host implementation.
"""
# ruff: noqa: F841

import logging

logger = logging.getLogger(__name__)
DEFAULT_VALUE_MAP = dict.fromkeys(
    (
        "int",
        "float",
        "bool",
        "string",
        "text",
        "list",
        "object",
        "dict",
        "template_list",
    )
)


class HostConfigNormalization:
    def _config_schema_to_default_config(self, schema: dict) -> dict:
        """将 Schema 转换成 Config"""
        conf = {}

        def _parse_schema(schema: dict, conf: dict) -> None:
            for k, v in schema.items():
                if v["type"] not in DEFAULT_VALUE_MAP:
                    raise TypeError(
                        f"不受支持的配置类型 {v['type']}。支持的类型有：{DEFAULT_VALUE_MAP.keys()}",
                    )
                if "default" in v:
                    default = v["default"]
                else:
                    default = DEFAULT_VALUE_MAP[v["type"]]

                if v["type"] == "object":
                    conf[k] = {}
                    _parse_schema(v["items"], conf[k])
                elif v["type"] == "template_list":
                    conf[k] = default
                else:
                    conf[k] = default

        _parse_schema(schema, conf)

        return conf

    def check_config_integrity(
        self, refer_conf: dict, conf: dict, path="", schema: dict | None = None
    ):
        """Check the integrity of a user config against its reference defaults.

        Args:
            refer_conf: Reference configuration holding default values.
            conf: User configuration, checked and normalized in place.
            path: Dot-separated path of the current level, used for logging.
            schema: Schema nodes parallel to ``refer_conf`` at this level. Entries
                declared as ``"type": "dict"`` are free-form mappings, so their
                user-added keys are preserved instead of being treated as stale.

        Returns:
            True if any items were added or the key order was fixed.
        """
        has_new = False

        # 创建一个新的有序字典以保持参考配置的顺序
        new_conf = {}

        # 先按照参考配置的顺序添加配置项
        for key, value in refer_conf.items():
            child_schema = schema.get(key) if schema else None
            if key not in conf:
                # 配置项不存在，插入默认值
                path_ = path + "." + key if path else key
                logger.info("Config key missing; added default.")
                new_conf[key] = value
                has_new = True
            elif conf[key] is None:
                # 配置项为 None，使用默认值
                new_conf[key] = value
                has_new = True
            elif isinstance(value, dict):
                # 递归检查子配置项
                if not isinstance(conf[key], dict):
                    # 类型不匹配，使用默认值
                    new_conf[key] = value
                    has_new = True
                elif (
                    isinstance(child_schema, dict)
                    and child_schema.get("type") == "dict"
                ):
                    # Free-form mapping declared as "type": "dict": user-added
                    # keys are data instead of stale entries, keep them as-is.
                    new_conf[key] = conf[key]
                elif (path + "." + key if path else key) == "agent_runner.config":
                    # Runner config is normalized according to runner_type when saved.
                    new_conf[key] = conf[key]
                else:
                    # 递归检查并同步顺序
                    child_items = (
                        child_schema.get("items")
                        if isinstance(child_schema, dict)
                        else None
                    )
                    child_has_new = self.check_config_integrity(
                        value,
                        conf[key],
                        path + "." + key if path else key,
                        schema=child_items if isinstance(child_items, dict) else None,
                    )
                    new_conf[key] = conf[key]
                    has_new |= child_has_new
            else:
                # 直接使用现有配置
                new_conf[key] = conf[key]

        # 检查是否存在参考配置中没有的配置项
        for key in list(conf.keys()):
            if key not in refer_conf:
                path_ = path + "." + key if path else key
                logger.info("Config key removed: %s", path_)
                has_new = True

        # 顺序不一致也算作变更
        if list(conf.keys()) != list(new_conf.keys()):
            if path:
                logger.info("Config key order fixed: %s", path)
            else:
                logger.info("Config key order fixed")
            has_new = True

        # 更新原始配置
        conf.clear()
        conf.update(new_conf)

        return has_new
