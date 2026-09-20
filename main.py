"""AstrBot entrypoint for Yomihime Quota Link."""

from astrbot.api.event import AstrMessageEvent, filter
from astrbot.api.star import Star, register


@register(
    "astrbot_plugin_yomihime_quota_link",
    "yomihime",
    "如月怜的额度连结：多平台 AI API 余额 / 用量监控。",
    "0.1.0",
)
class YomihimeQuotaLink(Star):
    """Monitor balances and usage across AI API providers."""

    @filter.command("yql")
    async def quota_link(self, event: AstrMessageEvent):
        """Show the plugin status and planned monitoring capabilities."""
        yield event.plain_result(
            "如月怜的额度连结\n"
            "多平台 AI API 余额 / 用量监控插件\n\n"
            "插件骨架已就绪。\n"
            "平台接入、余额查询、用量统计与额度告警功能正在规划中。"
        )
