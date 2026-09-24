import asyncio
from decimal import Decimal

import httpx
import pytest

from quota_link.http_client import (
    HttpProviderClient,
    HttpRequestError,
    HttpResponseParseError,
    HttpStatusError,
    HttpTransportError,
)


def make_client(handler):
    raw_client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    return HttpProviderClient(retry_delay=0, client=raw_client), raw_client


def test_json_numbers_are_parsed_as_decimal():
    async def run():
        client, _ = make_client(
            lambda request: httpx.Response(
                200, content=b'{"amount": 0.12345678901234567890123456789}'
            )
        )
        response = await client.request("GET", "https://provider.invalid/balance")
        return response.json()["amount"]

    assert asyncio.run(run()) == Decimal("0.12345678901234567890123456789")


@pytest.mark.parametrize("status", [429, 500, 503])
def test_retryable_status_retries_once(status):
    async def run():
        calls = 0

        def handler(request):
            nonlocal calls
            calls += 1
            return httpx.Response(status if calls == 1 else 200, json={"ok": True})

        client, _ = make_client(handler)
        response = await client.request("GET", "https://provider.invalid/balance")
        return calls, response.status_code

    assert asyncio.run(run()) == (2, 200)


@pytest.mark.parametrize("status", [301, 302, 400, 401, 403, 404])
def test_non_retryable_status_is_returned_as_safe_error(status):
    async def run():
        calls = 0

        def handler(request):
            nonlocal calls
            calls += 1
            return httpx.Response(
                status, headers={"location": "https://other.invalid/"}
            )

        client, _ = make_client(handler)
        with pytest.raises(HttpStatusError) as raised:
            await client.request(
                "GET",
                "https://provider.invalid/balance?token=super-secret",
                headers={"Authorization": "super-secret"},
            )
        return calls, raised.value

    calls, error = asyncio.run(run())
    assert calls == 1
    assert error.status_code == status
    assert "super-secret" not in str(error)
    assert "provider.invalid" not in repr(error)


def test_status_error_exposes_json_facade_without_leaking_it_in_error_text():
    async def run():
        client, _ = make_client(
            lambda request: httpx.Response(
                400,
                json={"Code": "NoPermission", "Message": "secret response detail"},
            )
        )
        with pytest.raises(HttpStatusError) as raised:
            await client.request("GET", "https://provider.invalid/?key=query-secret")
        return raised.value

    error = asyncio.run(run())
    assert error.response is not None
    assert error.response.status_code == 400
    assert error.response.json() == {
        "Code": "NoPermission",
        "Message": "secret response detail",
    }
    assert "secret response detail" not in str(error)
    assert "secret response detail" not in repr(error)
    assert "query-secret" not in repr(error)


def test_invalid_error_body_does_not_replace_http_status_error():
    async def run():
        client, _ = make_client(
            lambda request: httpx.Response(400, content=b"credential=secret")
        )
        with pytest.raises(HttpStatusError) as raised:
            await client.request("GET", "https://provider.invalid/")
        return raised.value

    error = asyncio.run(run())
    assert error.status_code == 400
    assert error.response is not None
    with pytest.raises(HttpResponseParseError):
        error.response.json()


def test_connect_error_retries_once_and_hides_low_level_text():
    async def run():
        calls = 0

        def handler(request):
            nonlocal calls
            calls += 1
            if calls == 1:
                raise httpx.ConnectError(
                    "secret https://host.invalid/?key=secret", request=request
                )
            return httpx.Response(200, json={})

        client, _ = make_client(handler)
        result = await client.request("GET", "https://provider.invalid/")
        return calls, result.status_code

    assert asyncio.run(run()) == (2, 200)


def test_final_timeout_has_safe_typed_error():
    async def run():
        calls = 0

        def handler(request):
            nonlocal calls
            calls += 1
            raise httpx.ReadTimeout("credential=secret", request=request)

        client, _ = make_client(handler)
        with pytest.raises(HttpTransportError) as raised:
            await client.request("GET", "https://provider.invalid/")
        return calls, raised.value

    calls, error = asyncio.run(run())
    assert calls == 2
    assert error.kind == "timeout"
    assert "secret" not in str(error)


def test_params_factory_is_called_for_each_retry():
    async def run():
        calls = 0
        generated = []

        def handler(request):
            nonlocal calls
            calls += 1
            generated.append(request.url.params["nonce"])
            return httpx.Response(503 if calls == 1 else 200, json={})

        def make_params():
            return {"nonce": str(len(generated) + 1)}

        client, _ = make_client(handler)
        await client.request(
            "GET", "https://provider.invalid/", params_factory=make_params
        )
        return generated

    assert asyncio.run(run()) == ["1", "2"]


def test_params_and_factory_cannot_be_combined():
    async def run():
        client, _ = make_client(lambda request: httpx.Response(200))
        with pytest.raises(HttpRequestError) as raised:
            await client.request(
                "GET",
                "https://provider.invalid/",
                params={"a": "b"},
                params_factory=lambda: {"c": "d"},
            )
        return raised.value.kind

    assert asyncio.run(run()) == "params_conflict"


def test_non_https_url_is_rejected_before_network_access():
    async def run():
        client, _ = make_client(lambda request: pytest.fail("network called"))
        with pytest.raises(HttpRequestError) as raised:
            await client.request("GET", "http://provider.invalid/")
        return raised.value.kind

    assert asyncio.run(run()) == "insecure_scheme"


def test_invalid_json_raises_safe_parse_error():
    async def run():
        client, _ = make_client(
            lambda request: httpx.Response(200, content=b"credential=secret")
        )
        response = await client.request("GET", "https://provider.invalid/")
        with pytest.raises(HttpResponseParseError) as raised:
            response.json()
        return raised.value

    error = asyncio.run(run())
    assert "secret" not in str(error)


def test_close_is_idempotent_and_prevents_future_requests():
    async def run():
        client, raw_client = make_client(lambda request: httpx.Response(200))
        await client.close()
        await client.close()
        with pytest.raises(HttpRequestError) as raised:
            await client.request("GET", "https://provider.invalid/")
        return raw_client.is_closed, raised.value.kind

    assert asyncio.run(run()) == (True, "closed")


def test_cancellation_propagates_without_retry():
    async def run():
        calls = 0
        entered = asyncio.Event()

        async def handler(request):
            nonlocal calls
            calls += 1
            entered.set()
            await asyncio.Event().wait()

        client, _ = make_client(handler)
        task = asyncio.create_task(client.request("GET", "https://provider.invalid/"))
        await entered.wait()
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        return calls

    assert asyncio.run(run()) == 1
