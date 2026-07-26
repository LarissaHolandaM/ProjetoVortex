import test from "node:test";
import assert from "node:assert/strict";

import { buildAdPayload, getItemImage, FALLBACK_IMAGE } from "./marketplace.ts";
import type { AdFormState } from "../types";

test("buildAdPayload omits empty image and converts donations to free", () => {
  const form: AdFormState = {
    titulo: "Livro de Cálculo",
    descricao: "Excelente estado",
    categorias: ["Materiais"],
    preco: "12",
    tipo_negociacao: "doacao",
    condicao: "usado",
    localizacao: "",
    imagem_url: "   ",
    contato: "  fulano@email.com  ",
  };
  const payload = buildAdPayload(form);

  assert.equal(payload.preco, 0);
  assert.equal(payload.titulo, "Livro de Cálculo");
  assert.equal(payload.localizacao, "Campus");
  assert.equal(payload.condicao, "usado");
  assert.equal(payload.contato, "fulano@email.com");
  assert.deepEqual(payload.categorias, ["Materiais"]);
  assert.equal("imagem_url" in payload, false);
});

test("getItemImage uses fallback when the image URL is missing", () => {
  assert.equal(getItemImage({ imagem_url: undefined }), FALLBACK_IMAGE);
});
