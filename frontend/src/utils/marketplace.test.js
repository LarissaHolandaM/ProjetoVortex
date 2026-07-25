import test from "node:test";
import assert from "node:assert/strict";

import { buildAdPayload, getItemImage, FALLBACK_IMAGE } from "./marketplace.js";

test("buildAdPayload omits empty image and converts donations to free", () => {
  const payload = buildAdPayload({
    titulo: "Livro de Cálculo",
    descricao: "Excelente estado",
    categoria: "Livros",
    preco: "12",
    tipo_negociacao: "doacao",
    localizacao: "",
    imagem_url: "   ",
  });

  assert.equal(payload.preco, 0);
  assert.equal(payload.titulo, "Livro de Cálculo");
  assert.equal(payload.localizacao, "Campus");
  assert.equal("imagem_url" in payload, false);
});

test("getItemImage uses fallback when the image URL is missing", () => {
  assert.equal(getItemImage({ titulo: "Caneta" }), FALLBACK_IMAGE);
});
