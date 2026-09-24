"""Immutable, provider-independent request and balance models."""

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import StrEnum


class ProviderType(StrEnum):
    """Provider configuration types recognized by the first release."""

    ALIBABA_BAILIAN = "alibaba_bailian"
    DEEPSEEK = "deepseek"
    OPENAI_COMPATIBLE = "openai_compatible"


SUPPORTED_PROVIDER_TYPES = frozenset(ProviderType)


class QueryRequestKind(StrEnum):
    ALL = "all"
    PROVIDER = "provider"
    ACCOUNT = "account"
    HELP = "help"
    STATUS = "status"


class QueryParseErrorCode(StrEnum):
    INVALID_INPUT = "invalid_input"
    UNKNOWN_TARGET = "unknown_target"
    AMBIGUOUS = "ambiguous"


class BalanceItemKind(StrEnum):
    CASH = "cash"
    QUOTA = "quota"
    FREE_QUOTA = "free_quota"
    SUBSCRIPTION = "subscription"
    CREDITS = "credits"
    USAGE = "usage"
    CUSTOM = "custom"


class SnapshotStatus(StrEnum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    PARTIAL = "partial"
    UNKNOWN = "unknown"


class ProviderErrorCategory(StrEnum):
    CONFIGURATION = "configuration"
    AUTHENTICATION = "authentication"
    PERMISSION = "permission"
    ENDPOINT = "endpoint"
    RATE_LIMITED = "rate_limited"
    TEMPORARILY_UNAVAILABLE = "temporarily_unavailable"
    PARSE = "parse"
    NOT_IMPLEMENTED = "not_implemented"


def _require_nonempty(value: str, field_name: str) -> None:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string")


def _require_aware(value: datetime | None, field_name: str) -> None:
    if value is not None and (value.tzinfo is None or value.utcoffset() is None):
        raise ValueError(f"{field_name} must be timezone-aware")


def _validate_decimal(value: Decimal | None, field_name: str) -> None:
    if value is not None and (not isinstance(value, Decimal) or not value.is_finite()):
        raise ValueError(f"{field_name} must be a finite Decimal or None")


@dataclass(frozen=True, slots=True)
class QueryRequest:
    """A parsed request; account and provider targets are kept as plain names."""

    kind: QueryRequestKind
    target: str | None = None

    def __post_init__(self) -> None:
        if not isinstance(self.kind, QueryRequestKind):
            raise TypeError("kind must be a QueryRequestKind")
        if self.kind in (QueryRequestKind.ACCOUNT, QueryRequestKind.PROVIDER):
            _require_nonempty(self.target or "", "target")
            object.__setattr__(self, "target", self.target.strip())
        elif self.target is not None:
            raise ValueError(f"{self.kind.value} requests cannot have a target")


@dataclass(frozen=True, slots=True)
class QueryParseError:
    """Safe, structured parse failure suitable for later presentation."""

    code: QueryParseErrorCode
    safe_message: str
    candidates: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not isinstance(self.code, QueryParseErrorCode):
            raise TypeError("code must be a QueryParseErrorCode")
        _require_nonempty(self.safe_message, "safe_message")
        object.__setattr__(self, "candidates", tuple(self.candidates))
        for candidate in self.candidates:
            _require_nonempty(candidate, "candidate")


@dataclass(frozen=True, slots=True)
class QueryParseResult:
    """Exactly one of request or error, with ambiguity candidates on the error."""

    request: QueryRequest | None = None
    error: QueryParseError | None = None

    def __post_init__(self) -> None:
        if (self.request is None) == (self.error is None):
            raise ValueError("exactly one of request or error must be provided")

    @property
    def candidates(self) -> tuple[str, ...]:
        return self.error.candidates if self.error is not None else ()


@dataclass(frozen=True, slots=True)
class NormalizedProviderError:
    """Safe provider failure; never stores response bodies or exception objects."""

    category: ProviderErrorCategory
    safe_message: str
    diagnostic_code: str | None = None

    def __post_init__(self) -> None:
        if not isinstance(self.category, ProviderErrorCategory):
            raise TypeError("category must be a ProviderErrorCategory")
        _require_nonempty(self.safe_message, "safe_message")
        if self.diagnostic_code is not None:
            _require_nonempty(self.diagnostic_code, "diagnostic_code")


@dataclass(frozen=True, slots=True)
class BalanceItem:
    """One semantically distinct balance or usage amount."""

    kind: BalanceItemKind
    amount: Decimal | None = None
    unit: str = "custom"
    total: Decimal | None = None
    remaining: Decimal | None = None
    used: Decimal | None = None
    expires_at: datetime | None = None
    label: str = ""
    raw_semantics: str | None = None

    def __post_init__(self) -> None:
        if not isinstance(self.kind, BalanceItemKind):
            raise TypeError("kind must be a BalanceItemKind")
        _require_nonempty(self.unit, "unit")
        for name in ("amount", "total", "remaining", "used"):
            _validate_decimal(getattr(self, name), name)
        _require_aware(self.expires_at, "expires_at")


@dataclass(frozen=True, slots=True)
class BalanceSnapshot:
    """A provider-independent result for one stable account id."""

    account_id: str
    provider_type: ProviderType
    display_name: str
    status: SnapshotStatus
    balances: tuple[BalanceItem, ...]
    source: str
    fetched_at: datetime
    cached: bool = False
    error: NormalizedProviderError | None = None

    def __post_init__(self) -> None:
        _require_nonempty(self.account_id, "account_id")
        _require_nonempty(self.display_name, "display_name")
        _require_nonempty(self.source, "source")
        if not isinstance(self.provider_type, ProviderType):
            raise TypeError("provider_type must be a ProviderType")
        if not isinstance(self.status, SnapshotStatus):
            raise TypeError("status must be a SnapshotStatus")
        if self.error is not None and not isinstance(
            self.error, NormalizedProviderError
        ):
            raise TypeError("error must be a NormalizedProviderError or None")
        _require_aware(self.fetched_at, "fetched_at")
        object.__setattr__(self, "balances", tuple(self.balances))
        if any(not isinstance(item, BalanceItem) for item in self.balances):
            raise TypeError("balances must contain only BalanceItem values")


@dataclass(frozen=True, slots=True)
class QueryResult:
    """An immutable aggregate outcome for one parsed request."""

    request: QueryRequest
    snapshots: tuple[BalanceSnapshot, ...]
    queried_at: datetime

    def __post_init__(self) -> None:
        if not isinstance(self.request, QueryRequest):
            raise TypeError("request must be a QueryRequest")
        object.__setattr__(self, "snapshots", tuple(self.snapshots))
        if any(
            not isinstance(snapshot, BalanceSnapshot) for snapshot in self.snapshots
        ):
            raise TypeError("snapshots must contain only BalanceSnapshot values")
        _require_aware(self.queried_at, "queried_at")
