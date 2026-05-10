import { env } from "../env";

const bearerAuth = {
  bearerAuth: [],
};

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Blinky API — BeWork",
    description:
      "API para geração dinâmica de URLs com parâmetros e redirects.",
    version: "1.0.0",
  },
  servers: [{ url: `${env.APP_URL}/api` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Link: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          baseUrl: { type: "string", format: "uri" },
          projectId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Parameter: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          key: { type: "string" },
          value: { type: "string" },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Redirect: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          redirectUrl: { type: "string", format: "uri" },
          linkId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", minLength: 2, example: "Blinky" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "blinky@gmail.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "blinky123",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "blinky@gmail.com",
                  },
                  password: { type: "string", example: "blinky123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "eyJhbGci..." },
                  },
                },
              },
            },
          },
          400: {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    "/projects": {
      post: {
        tags: ["Projects"],
        summary: "Criar projeto",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    minLength: 1,
                    example: "Campanha FB",
                  },
                  description: {
                    type: "string",
                    example: "Links para campanhas do Facebook",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Projeto criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      get: {
        tags: ["Projects"],
        summary: "Listar projetos do usuário",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Lista de projetos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Project" },
                },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/projects/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      get: {
        tags: ["Projects"],
        summary: "Buscar projeto por ID",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Projeto encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      put: {
        tags: ["Projects"],
        summary: "Atualizar projeto",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 1 },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Projeto atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Deletar projeto",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Projeto deletado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },

    "/links": {
      post: {
        tags: ["Links"],
        summary: "Criar link",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["projectId", "name", "baseUrl"],
                properties: {
                  projectId: { type: "string", format: "uuid" },
                  name: {
                    type: "string",
                    minLength: 1,
                    example: "LP Principal",
                  },
                  baseUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://exemplo.com/lp",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Link criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Link" },
              },
            },
          },
          400: {
            description: "Dados inválidos ou projeto não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      get: {
        tags: ["Links"],
        summary: "Listar links de um projeto",
        security: [bearerAuth],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "ID do projeto",
          },
        ],
        responses: {
          200: {
            description: "Lista de links",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Link" },
                },
              },
            },
          },
          400: {
            description: "projectId inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/links/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      get: {
        tags: ["Links"],
        summary: "Buscar link por ID",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Link encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Link" },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      put: {
        tags: ["Links"],
        summary: "Atualizar link",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 1 },
                  baseUrl: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Link atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Link" },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      delete: {
        tags: ["Links"],
        summary: "Deletar link",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Link deletado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/links/{id}/generate": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      get: {
        tags: ["Links"],
        summary: "Gerar URL final do link",
        description:
          "Monta a URL com todos os parâmetros associados e o redirect (se houver). Resultado cacheado no Redis por 5 minutos.",
        security: [bearerAuth],
        responses: {
          200: {
            description: "URL gerada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      format: "uri",
                      example:
                        "https://exemplo.com/lp?utm_source=facebook&redirect=https://minha-lp.com/obrigado",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/links/{id}/parameters": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do link",
        },
      ],
      post: {
        tags: ["Links / Parâmetros"],
        summary: "Associar parâmetro ao link",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["parameterId"],
                properties: {
                  parameterId: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Parâmetro associado" },
          400: {
            description: "Link ou parâmetro não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/links/{id}/parameters/{parameterId}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do link",
        },
        {
          name: "parameterId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do parâmetro",
        },
      ],
      delete: {
        tags: ["Links / Parâmetros"],
        summary: "Desassociar parâmetro do link",
        security: [bearerAuth],
        responses: {
          200: { description: "Parâmetro removido do link" },
          400: {
            description: "Associação não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/links/{id}/redirect": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "ID do link",
        },
      ],
      post: {
        tags: ["Links / Redirect"],
        summary: "Criar redirect para o link",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["redirectUrl"],
                properties: {
                  redirectUrl: {
                    type: "string",
                    format: "uri",
                    example: "https://minha-lp.com/obrigado",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Redirect criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Redirect" },
              },
            },
          },
          400: {
            description: "Link não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      put: {
        tags: ["Links / Redirect"],
        summary: "Atualizar redirect do link",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["redirectUrl"],
                properties: {
                  redirectUrl: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Redirect atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Redirect" },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      delete: {
        tags: ["Links / Redirect"],
        summary: "Remover redirect do link",
        security: [bearerAuth],
        responses: {
          200: { description: "Redirect removido" },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },

    "/parameters": {
      post: {
        tags: ["Parameters"],
        summary: "Criar parâmetro",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["key", "value"],
                properties: {
                  key: { type: "string", minLength: 1, example: "utm_source" },
                  value: { type: "string", minLength: 1, example: "facebook" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Parâmetro criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Parameter" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
      get: {
        tags: ["Parameters"],
        summary: "Listar parâmetros do usuário",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Lista de parâmetros",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Parameter" },
                },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
    "/parameters/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      delete: {
        tags: ["Parameters"],
        summary: "Deletar parâmetro",
        security: [bearerAuth],
        responses: {
          200: {
            description: "Parâmetro deletado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
          400: {
            description: "Não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { description: "Não autorizado" },
        },
      },
    },
  },
};
