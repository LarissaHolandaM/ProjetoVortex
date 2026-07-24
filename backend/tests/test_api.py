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
        },
        headers=headers,
    )
    client.post(
        "/anuncios/",
        json={
            "titulo": "Carro Popular",
            "descricao": "ano 2017",
            "preco": 18000,
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
            "categoria": "Livros",
            "tipo_negociacao": "doacao",
            "condicao": "bom_estado",
            "localizacao": "Bloco B",
            "imagem_url": "https://example.com/livro.jpg",
        },
        headers=headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["categoria"] == "Livros"
    assert body["tipo_negociacao"] == "doacao"
    assert body["condicao"] == "bom_estado"
    assert body["localizacao"] == "Bloco B"
    assert body["imagem_url"] == "https://example.com/livro.jpg"


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
            "categoria": "Engenharia",
            "tipo_negociacao": "venda",
            "condicao": "usado",
            "localizacao": "Bloco C",
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
