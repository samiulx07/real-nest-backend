export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Real Nest API Documentation",
    version: "1.0.0",
    description: "Backend API documentation for Real Nest - Real Estate Management System",
    contact: {
      name: "Samiul Hasan (SAM)",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development Server",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health Check",
        description: "Check if the backend server is running and healthy.",
        tags: ["Utility"],
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Server is healthy!" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register User",
        description: "Create a new user account in the system.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid input or user already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login User",
        description: "Authenticate user credentials and retrieve an access token. Sets an HTTP-only refresh token in the cookies.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User logged in successfully",
            headers: {
              "Set-Cookie": {
                description: "Contains HTTP-only refreshToken cookie",
                schema: {
                  type: "string",
                  example: "refreshToken=abc...; Path=/; HttpOnly; SameSite=Strict",
                },
              },
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials (password mismatched)",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "403": {
            description: "User account is inactive",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/refresh": {
      post: {
        summary: "Refresh Access Token",
        description: "Generate a new access token using the HTTP-only refresh token stored in cookies.",
        tags: ["Authentication"],
        responses: {
          "200": {
            description: "Access token retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RefreshTokenResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid or expired refresh token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Get Current User Profile",
        description: "Retrieve profile information of the currently authenticated user.",
        tags: ["Authentication"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProfileResponse",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized, missing, or invalid Bearer access token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string", nullable: true },
          role: { type: "string", enum: ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: { type: "string", minLength: 2, example: "John Doe" },
          email: { type: "string", format: "email", example: "john.doe@example.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          phone: { type: "string", example: "+1234567890" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john.doe@example.com" },
          password: { type: "string", minLength: 1, example: "password123" },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User registered successfully" },
          data: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User logged in successfully" },
          data: {
            type: "object",
            properties: {
              user: {
                $ref: "#/components/schemas/User",
              },
              accessToken: { type: "string" },
            },
          },
        },
      },
      RefreshTokenResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Access token is retrieved successfully" },
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
          },
        },
      },
      ProfileResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User profile retrieved successfully" },
          data: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message details" },
          errorMessages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string", example: "email" },
                message: { type: "string", example: "Invalid email address" },
              },
            },
          },
        },
      },
    },
  },
};
