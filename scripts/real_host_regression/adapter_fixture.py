"""Offline OneBot transport fixture using the unmodified AstrBot adapter.

Set ASTRBOT_DISABLE_METRICS=1 and your isolated ASTRBOT_ROOT before importing
AstrBot. Install only after the host initializes its platform manager. This
fixture constructs but never starts the adapter; it binds no listening socket.
The harness must independently deny network access.
"""

from __future__ import annotations

import os
from copy import deepcopy
from dataclasses import dataclass, field
from typing import Any


@dataclass
class OfflineOneBotFixture:
    """Capture final OneBot actions while retaining the real adapter pipeline."""

    adapter: Any
    platform_manager: Any
    calls: list[dict[str, Any]] = field(default_factory=list)
    failures: list[Exception] = field(default_factory=list)

    def detach(self) -> None:
        """Remove this unstarted adapter from its platform manager."""
        if self.adapter in self.platform_manager.platform_insts:
            self.platform_manager.platform_insts.remove(self.adapter)


def install_offline_onebot(context: Any, platform_id: str = "yql-offline-onebot"):
    """Attach a real adapter with only its final OneBot API call intercepted.

    Args:
        context: The initialized real AstrBot Context.
        platform_id: Synthetic platform instance ID used as the UMO prefix.

    Returns:
        An OfflineOneBotFixture exposing adapter, calls, failures, and detach.

    Raises:
        RuntimeError: Metrics are not disabled or the instance ID already exists.
    """
    if os.environ.get("ASTRBOT_DISABLE_METRICS") != "1":
        raise RuntimeError("Set ASTRBOT_DISABLE_METRICS=1 before using the fixture")
    if context.get_platform_inst(platform_id) is not None:
        raise RuntimeError("The synthetic platform ID is already in use")

    from astrbot.core.platform.sources.aiocqhttp.aiocqhttp_platform_adapter import (
        AiocqhttpAdapter,
    )

    manager = context.platform_manager
    adapter = AiocqhttpAdapter(
        platform_config={
            "id": platform_id,
            "type": "aiocqhttp",
            "enable": False,
            "ws_reverse_host": "127.0.0.1",
            "ws_reverse_port": 6199,
            "ws_reverse_token": "",
        },
        platform_settings=context.get_config().get("platform_settings", {}),
        event_queue=context.get_event_queue(),
    )
    fixture = OfflineOneBotFixture(adapter, manager)

    async def capture_action(action: str, **params: Any) -> dict[str, int]:
        if action not in {"send_group_msg", "send_private_msg"}:
            raise AssertionError(f"Unexpected offline OneBot action: {action}")
        fixture.calls.append({"action": action, "params": deepcopy(params)})
        if fixture.failures:
            raise fixture.failures.pop(0)
        return {"message_id": len(fixture.calls)}

    # Preserve CQHttp.__getattr__, CQHttp.call_action, AstrBot serialization,
    # Context.send_message, and adapter.send_by_session. Only replace the final
    # UnifiedApi transport boundary, which would otherwise need a live peer.
    adapter.bot._api.call_action = capture_action
    manager.platform_insts.append(adapter)
    return fixture
