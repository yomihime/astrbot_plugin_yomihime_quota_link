#!/usr/bin/env bash
# Run only against a disposable root; all account and transport data is synthetic.
set -euo pipefail
: "${QUOTA_TEST_PYTHON:?Set this to an isolated Python with AstrBot 4.29.1 dependencies}"
: "${QUOTA_TEST_ASTRBOT_SOURCE:?Set this to the clean official v4.29.1 checkout}"
: "${QUOTA_TEST_PLUGIN_ZIP:?Set this to the exact candidate ZIP}"
: "${QUOTA_TEST_WORK_ROOT:?Set this to a NEW nonexistent disposable directory}"
: "${QUOTA_TEST_FONT:?Set this to the pinned NotoSansCJKsc-Regular.otf}"
script_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
exec "$QUOTA_TEST_PYTHON" "$script_root/run_real_host.py"
