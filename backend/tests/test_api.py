import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_database():
    from app.core.database import Base, engine
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "Vortex API online"


def test_register_and_login_flow():
    register_response = client.post(
        "/auth/register",
        json={
            "nome": "Ana",
            "email": "ana@email.com",
            "senha": "123456",
        },
    )

    assert register_response.status_code == 201
    body = register_response.json()
    assert body["usuario"]["email"] == "ana@email.com"
    assert "access_token" in body

    login_response = client.post(
        "/auth/login",
        json={
            "email": "ana@email.com",
            "senha": "123456",
        },
    )

    assert login_response.status_code == 200
    assert "access_token" in login_response.json()


def test_create_anuncio_requires_authentication():
    response = client.post(
        "/anuncios/",
        json={
            "titulo": "Carro em ótimo estado",
            "descricao": "Sedan azul, 2018",
            "preco": 55000.0,
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Não autorizado"


def test_create_anuncio_with_authenticated_user():
    register_response = client.post(
        "/auth/register",
        json={
            "nome": "Bruno",
            "email": "bruno@email.com",
            "senha": "654321",
        },
    )

    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/anuncios/",
        json={
            "titulo": "Notebook Gamer",
            "descricao": "RTX 3060",
            "preco": 4200.5,
            "contato": "bruno@email.com",
        },
        headers=headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["titulo"] == "Notebook Gamer"
    assert body["usuario_id"] == 1


def test_list_anuncios_with_pagination_and_filter():
    register_response = client.post(
        "/auth/register",
        json={
            "nome": "Carla",
            "email": "carla@email.com",
            "senha": "123456",
        },
    )

    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/anuncios/",
        json={
            "titulo": "Notebook Dell",
            "descricao": "i7 16gb",
            "preco": 3000,
            "contato": "carla@email.com",
        },
        headers=headers,
    )
    client.post(
        "/anuncios/",
        json={
            "titulo": "Carro Popular",
            "descricao": "ano 2017",
            "preco": 18000,
            "contato": "carla@email.com",
        },
        headers=headers,
    )

    response = client.get("/anuncios/?titulo=notebook&skip=0&limit=1")

    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 1
    assert body["items"][0]["titulo"] == "Notebook Dell"
    assert body["total"] == 2


def test_create_anuncio_with_marketplace_fields():
    register_response = client.post(
        "/auth/register",
        json={
            "nome": "Elisa",
            "email": "elisa@email.com",
            "senha": "123456",
        },
    )

    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/anuncios/",
        json={
            "titulo": "Livro de Algoritmos",
            "descricao": "Livro usado, com marcações leves",
            "preco": 0,
            "categorias": ["Tecnologia", "Materiais"],
            "tipo_negociacao": "doacao",
            "condicao": "bom_estado",
            "localizacao": "Bloco B",
            "imagem_url": "https://example.com/livro.jpg",
            "contato": "elisa@email.com",
        },
        headers=headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["categoria"] == "Tecnologia"
    assert body["categorias"] == ["Tecnologia", "Materiais"]
    assert body["tipo_negociacao"] == "doacao"
    assert body["condicao"] == "bom_estado"
    assert body["localizacao"] == "Bloco B"
    assert body["imagem_url"] == "https://example.com/livro.jpg"
    assert body["contato"] == "elisa@email.com"


def test_criar_anuncio_com_categoria_invalida_retorna_422():
    register_response = client.post(
        "/auth/register",
        json={"nome": "Lia", "email": "lia@email.com", "senha": "123456"},
    )
    headers = {"Authorization": f"Bearer {register_response.json()['access_token']}"}

    response = client.post(
        "/anuncios/",
        json={
            "titulo": "Item qualquer",
            "descricao": "Descrição válida",
            "preco": 10,
            "categorias": ["Categoria Fantasia"],
            "contato": "lia@email.com",
        },
        headers=headers,
    )

    assert response.status_code == 422


def test_filtrar_anuncios_por_categoria_e_por_vendedor():
    register_response = client.post(
        "/auth/register",
        json={"nome": "Marina", "email": "marina@email.com", "senha": "123456"},
    )
    token = register_response.json()["access_token"]
    usuario_id = register_response.json()["usuario"]["id"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/anuncios/",
        json={
            "titulo": "Estetoscópio",
            "descricao": "Usado em bom estado",
            "preco": 150,
            "categorias": ["Saúde"],
            "contato": "marina@email.com",
        },
        headers=headers,
    )
    client.post(
        "/anuncios/",
        json={
            "titulo": "Cadeira",
            "descricao": "Item de casa",
            "preco": 80,
            "categorias": ["Casa"],
            "contato": "marina@email.com",
        },
        headers=headers,
    )

    por_categoria = client.get("/anuncios/?categoria=Saúde")
    assert por_categoria.status_code == 200
    assert por_categoria.json()["total"] == 1
    assert por_categoria.json()["items"][0]["titulo"] == "Estetoscópio"

    por_vendedor = client.get(f"/anuncios/?usuario_id={usuario_id}")
    assert por_vendedor.status_code == 200
    assert por_vendedor.json()["total"] == 2


def test_atualizar_perfil_do_usuario():
    register_response = client.post(
        "/auth/register",
        json={"nome": "Nina", "email": "nina@email.com", "senha": "123456"},
    )
    headers = {"Authorization": f"Bearer {register_response.json()['access_token']}"}

    response = client.put(
        "/auth/me",
        json={"nome": "Nina Souza"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["nome"] == "Nina Souza"


def test_list_my_anuncios():
    register_response = client.post(
        "/auth/register",
        json={
            "nome": "Fábio",
            "email": "fabio@email.com",
            "senha": "123456",
        },
    )

    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/anuncios/",
        json={
            "titulo": "Calculadora Científica",
            "descricao": "Boa para engenharia",
            "preco": 120,
            "categorias": ["Tecnologia"],
            "tipo_negociacao": "venda",
            "condicao": "usado",
            "localizacao": "Bloco C",
            "contato": "fabio@email.com",
        },
        headers=headers,
    )

    response = client.get("/anuncios/meus", headers=headers)

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["titulo"] == "Calculadora Científica"


def test_update_and_delete_anuncio():
    register_response = client.post(
        "/auth/register",
        json={
            "nome": "Davi",
            "email": "davi@email.com",
            "senha": "123456",
        },
    )

    token = register_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    created = client.post(
        "/anuncios/",
        json={
            "titulo": "Mesa de Escritório",
            "descricao": "Madeira maciça",
            "preco": 450,
            "contato": "davi@email.com",
        },
        headers=headers,
    )

    anuncio_id = created.json()["id"]

    update_response = client.put(
        f"/anuncios/{anuncio_id}",
        json={"titulo": "Mesa Gamer", "descricao": "Nova descrição", "preco": 500},
        headers=headers,
    )

    assert update_response.status_code == 200
    assert update_response.json()["titulo"] == "Mesa Gamer"

    delete_response = client.delete(f"/anuncios/{anuncio_id}", headers=headers)

    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Anúncio removido com sucesso"


def test_favoritar_e_listar_favoritos():
    dono = client.post(
        "/auth/register",
        json={"nome": "Gustavo", "email": "gustavo@email.com", "senha": "123456"},
    )
    dono_headers = {"Authorization": f"Bearer {dono.json()['access_token']}"}

    anuncio = client.post(
        "/anuncios/",
        json={
            "titulo": "Bicicleta Aro 29",
            "descricao": "Pouco uso, revisada",
            "preco": 800,
            "contato": "gustavo@email.com",
        },
        headers=dono_headers,
    )
    anuncio_id = anuncio.json()["id"]

    interessado = client.post(
        "/auth/register",
        json={"nome": "Helena", "email": "helena@email.com", "senha": "123456"},
    )
    headers = {"Authorization": f"Bearer {interessado.json()['access_token']}"}

    add_response = client.post(f"/favoritos/{anuncio_id}", headers=headers)
    assert add_response.status_code == 201
    assert add_response.json()["message"] == "Anúncio adicionado aos favoritos"

    # favoritar de novo deve ser idempotente (não duplica, não quebra)
    repeat_response = client.post(f"/favoritos/{anuncio_id}", headers=headers)
    assert repeat_response.status_code == 201

    ids_response = client.get("/favoritos/ids", headers=headers)
    assert ids_response.status_code == 200
    assert ids_response.json() == [anuncio_id]

    list_response = client.get("/favoritos/", headers=headers)
    assert list_response.status_code == 200
    body = list_response.json()
    assert body["total"] == 1
    assert body["items"][0]["titulo"] == "Bicicleta Aro 29"

    remove_response = client.delete(f"/favoritos/{anuncio_id}", headers=headers)
    assert remove_response.status_code == 200
    assert remove_response.json()["message"] == "Anúncio removido dos favoritos"

    empty_response = client.get("/favoritos/", headers=headers)
    assert empty_response.json()["total"] == 0


def test_favoritar_anuncio_inexistente_retorna_404():
    usuario = client.post(
        "/auth/register",
        json={"nome": "Igor", "email": "igor@email.com", "senha": "123456"},
    )
    headers = {"Authorization": f"Bearer {usuario.json()['access_token']}"}

    response = client.post("/favoritos/9999", headers=headers)
    assert response.status_code == 404


def test_remover_favorito_inexistente_retorna_404():
    usuario = client.post(
        "/auth/register",
        json={"nome": "Julia", "email": "julia@email.com", "senha": "123456"},
    )
    headers = {"Authorization": f"Bearer {usuario.json()['access_token']}"}

    anuncio = client.post(
        "/anuncios/",
        json={"titulo": "Fone Bluetooth", "descricao": "Seminovo", "preco": 90, "contato": "julia@email.com"},
        headers=headers,
    )
    anuncio_id = anuncio.json()["id"]

    response = client.delete(f"/favoritos/{anuncio_id}", headers=headers)
    assert response.status_code == 404


def test_favoritos_requer_autenticacao():
    response = client.get("/favoritos/")
    assert response.status_code == 401


def test_criar_anuncio_sem_contato_retorna_422():
    register_response = client.post(
        "/auth/register",
        json={"nome": "Karen", "email": "karen@email.com", "senha": "123456"},
    )
    headers = {"Authorization": f"Bearer {register_response.json()['access_token']}"}

    response = client.post(
        "/anuncios/",
        json={"titulo": "Cadeira Gamer", "descricao": "Pouco uso", "preco": 300},
        headers=headers,
    )

    assert response.status_code == 422
