"""Native AstrBot plugin page administration, using Dashboard-owned authority."""

from .pages import AdminPages
from .web_admin import AdminAuthorizationDenied

__all__ = ["AdminPages", "AdminAuthorizationDenied"]
