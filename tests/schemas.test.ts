import { describe, test, expect } from "bun:test";
import { registerSchema, loginSchema } from "../src/schemas/auth.schema";
import { createLinkSchema, updateLinkSchema, addParameterToLinkSchema } from "../src/schemas/links.schema";
import { createParameterSchema } from "../src/schemas/parameters.schema";

describe("registerSchema", () => {
  test("aceita dados válidos", () => {
    const result = registerSchema.safeParse({ name: "João", email: "joao@email.com", password: "senha123" });
    expect(result.success).toBe(true);
  });

  test("rejeita email inválido", () => {
    const result = registerSchema.safeParse({ name: "João", email: "nao-e-email", password: "senha123" });
    expect(result.success).toBe(false);
  });

  test("rejeita senha com menos de 6 caracteres", () => {
    const result = registerSchema.safeParse({ name: "João", email: "joao@email.com", password: "123" });
    expect(result.success).toBe(false);
  });

  test("rejeita nome com menos de 2 caracteres", () => {
    const result = registerSchema.safeParse({ name: "J", email: "joao@email.com", password: "senha123" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  test("aceita credenciais válidas", () => {
    const result = loginSchema.safeParse({ email: "joao@email.com", password: "senha123" });
    expect(result.success).toBe(true);
  });

  test("rejeita quando o email está ausente", () => {
    const result = loginSchema.safeParse({ password: "senha123" });
    expect(result.success).toBe(false);
  });
});

describe("createLinkSchema", () => {
  test("aceita link válido", () => {
    const result = createLinkSchema.safeParse({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Campanha Facebook",
      baseUrl: "https://example.com/page",
    });
    expect(result.success).toBe(true);
  });

  test("rejeita baseUrl que não é uma URL", () => {
    const result = createLinkSchema.safeParse({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Campanha Facebook",
      baseUrl: "nao-e-uma-url",
    });
    expect(result.success).toBe(false);
  });

  test("rejeita projectId que não é um UUID", () => {
    const result = createLinkSchema.safeParse({
      projectId: "id-invalido",
      name: "Campanha Facebook",
      baseUrl: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  test("rejeita name vazio", () => {
    const result = createLinkSchema.safeParse({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      name: "",
      baseUrl: "https://example.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateLinkSchema", () => {
  test("aceita atualização parcial com apenas name", () => {
    const result = updateLinkSchema.safeParse({ name: "Novo nome" });
    expect(result.success).toBe(true);
  });

  test("aceita objeto vazio", () => {
    const result = updateLinkSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test("rejeita baseUrl inválida mesmo em atualização parcial", () => {
    const result = updateLinkSchema.safeParse({ baseUrl: "nao-e-url" });
    expect(result.success).toBe(false);
  });
});

describe("createParameterSchema", () => {
  test("aceita key e value válidos", () => {
    const result = createParameterSchema.safeParse({ key: "utm_source", value: "google" });
    expect(result.success).toBe(true);
  });

  test("rejeita key vazia", () => {
    const result = createParameterSchema.safeParse({ key: "", value: "google" });
    expect(result.success).toBe(false);
  });

  test("rejeita value vazio", () => {
    const result = createParameterSchema.safeParse({ key: "utm_source", value: "" });
    expect(result.success).toBe(false);
  });
});

describe("addParameterToLinkSchema", () => {
  test("aceita UUID válido", () => {
    const result = addParameterToLinkSchema.safeParse({ parameterId: "550e8400-e29b-41d4-a716-446655440000" });
    expect(result.success).toBe(true);
  });

  test("rejeita ID que não é UUID", () => {
    const result = addParameterToLinkSchema.safeParse({ parameterId: "abc123" });
    expect(result.success).toBe(false);
  });
});
