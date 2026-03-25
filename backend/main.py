from litestar import Litestar, get

@get('/test')
async def test() -> str:
    return "welcome to the backend"

app = Litestar([test])