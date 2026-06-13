export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Estuda+ - Microsservico de Usuarios",
    version: "1.0.0",
    description: "CRUD de usuarios e autenticacao JWT (PostgreSQL)"
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      RegisterUser: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 }
        }
      },
      LoginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" }
        }
      },
      UpdateUser: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" }
        }
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Registra novo usuario",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterUser" } } }
        },
        responses: {
          "201": { description: "Usuario criado, retorna token" },
          "409": { description: "Email ja cadastrado" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Autentica usuario",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginUser" } } }
        },
        responses: {
          "200": { description: "Login com sucesso, retorna token" },
          "401": { description: "Credenciais invalidas" }
        }
      }
    },
    "/api/users/me": {
      get: {
        summary: "Retorna usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Dados do usuario" },
          "401": { description: "Nao autenticado" }
        }
      },
      patch: {
        summary: "Atualiza usuario autenticado",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUser" } } }
        },
        responses: {
          "200": { description: "Usuario atualizado" },
          "401": { description: "Nao autenticado" }
        }
      },
      delete: {
        summary: "Remove usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Usuario removido" },
          "401": { description: "Nao autenticado" }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        summary: "Busca usuario por id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Usuario encontrado" },
          "404": { description: "Usuario nao encontrado" }
        }
      }
    }
  }
};
