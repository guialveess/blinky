import { describe, test, expect, mock } from "bun:test";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../src/lib/async-handler";

function makeRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: unknown) {
      this.body = data;
      return this;
    },
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
}

const req = {} as Request;
const next = mock(() => {}) as unknown as NextFunction;

describe("asyncHandler", () => {
  test("executa o handler e repassa req/res normalmente", async () => {
    const res = makeRes();
    const handler = asyncHandler(async (_req, res) => {
      res.status(200).json({ ok: true });
    });

    await handler(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("retorna 400 quando o handler lança um Error com mensagem", async () => {
    const res = makeRes();
    const handler = asyncHandler(async () => {
      throw new Error("recurso não encontrado");
    });

    await handler(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "recurso não encontrado" });
  });

  test("retorna 500 quando o handler lança um valor não-Error", async () => {
    const res = makeRes();
    const handler = asyncHandler(async () => {
      throw "erro inesperado";
    });

    await handler(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: "Erro interno" });
  });
});
