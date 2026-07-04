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
      url: "/api/v1",
      description: "Current Server (Relative Path)",
    },
    {
      url: "http://localhost:5000/api/v1",
      description: "Local Development Server",
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
    "/properties": {
      get: {
        summary: "Get All Properties",
        description: "Retrieve a paginated list of properties with optional filters and sorting.",
        tags: ["Properties"],
        parameters: [
          { name: "search", in: "query", description: "Search by title or address", schema: { type: "string" } },
          { name: "city", in: "query", description: "Filter by city", schema: { type: "string" } },
          { name: "area", in: "query", description: "Filter by area", schema: { type: "string" } },
          { name: "status", in: "query", description: "Filter by property status (e.g. Ongoing, Completed)", schema: { type: "string" } },
          { name: "isFeatured", in: "query", description: "Filter by featured status", schema: { type: "boolean" } },
          { name: "page", in: "query", description: "Page number", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", description: "Number of records per page", schema: { type: "integer", default: 10 } },
          { name: "sortBy", in: "query", description: "Field to sort by", schema: { type: "string", default: "createdAt" } },
          { name: "sortOrder", in: "query", description: "Sorting order", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          "200": {
            description: "Properties retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PropertyListResponse",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create Property",
        description: "Add a new real estate property. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Properties"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreatePropertyRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Property created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PropertyResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid input values",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
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
    "/properties/{id}": {
      get: {
        summary: "Get Single Property",
        description: "Retrieve detailed information of a property by ID.",
        tags: ["Properties"],
        parameters: [
          { name: "id", in: "path", required: true, description: "Property UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Property retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PropertyResponse",
                },
              },
            },
          },
          "404": {
            description: "Property not found",
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
      patch: {
        summary: "Update Property",
        description: "Modify dynamic attributes of an existing property. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Properties"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Property UUID", schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdatePropertyRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Property updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PropertyResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid inputs",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "Property not found",
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
      delete: {
        summary: "Delete Property",
        description: "Hard-delete a property from database. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Properties"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Property UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Property deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Property deleted successfully" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "Property not found",
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
          fullName: { type: "string", minLength: 2, example: "Samiul Hasan" },
          email: { type: "string", format: "email", example: "samiul.hasan@example.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          phone: { type: "string", example: "+1234567890" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "samiul.hasan@example.com" },
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
      Property: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          address: { type: "string" },
          area: { type: "string" },
          city: { type: "string" },
          latitude: { type: "number", nullable: true },
          longitude: { type: "number", nullable: true },
          floorLabel: { type: "string" },
          totalFloors: { type: "integer" },
          totalUnits: { type: "integer" },
          unitsPerFloor: { type: "integer", nullable: true },
          startingPrice: { type: "number", nullable: true },
          handoverDate: { type: "string", format: "date-time", nullable: true },
          landArea: { type: "string", nullable: true },
          facing: { type: "string", nullable: true },
          roadSize: { type: "string", nullable: true },
          parkingAvailable: { type: "boolean" },
          liftAvailable: { type: "boolean" },
          generatorBackup: { type: "boolean" },
          securityAvailable: { type: "boolean" },
          imageUrls: { type: "array", items: { type: "string" } },
          amenities: { type: "array", items: { type: "string" } },
          status: { type: "string", nullable: true },
          isFeatured: { type: "boolean" },
          isPublished: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreatePropertyRequest: {
        type: "object",
        required: ["title", "address", "area", "floorLabel", "totalFloors", "totalUnits"],
        properties: {
          title: { type: "string", example: "Grand Rose Villa" },
          slug: { type: "string", example: "grand-rose-villa" },
          description: { type: "string", example: "Luxury apartments in Gulshan" },
          address: { type: "string", example: "Road 12, House 4, Gulshan 1" },
          area: { type: "string", example: "Gulshan" },
          city: { type: "string", default: "Dhaka", example: "Dhaka" },
          latitude: { type: "number", example: 23.7925 },
          longitude: { type: "number", example: 90.4078 },
          floorLabel: { type: "string", example: "G+9" },
          totalFloors: { type: "integer", example: 10 },
          totalUnits: { type: "integer", example: 20 },
          unitsPerFloor: { type: "integer", example: 2 },
          startingPrice: { type: "number", example: 18000000 },
          handoverDate: { type: "string", format: "date-time", example: "2027-12-31T00:00:00.000Z" },
          landArea: { type: "string", example: "5 Katha" },
          facing: { type: "string", example: "South" },
          roadSize: { type: "string", example: "30 Feet" },
          parkingAvailable: { type: "boolean", default: true },
          liftAvailable: { type: "boolean", default: true },
          generatorBackup: { type: "boolean", default: true },
          securityAvailable: { type: "boolean", default: true },
          imageUrls: { type: "array", items: { type: "string" }, example: ["https://example.com/property1.jpg"] },
          amenities: { type: "array", items: { type: "string" }, example: ["Rooftop Pool", "Gym", "Community Hall"] },
          status: { type: "string", example: "Ongoing" },
          isFeatured: { type: "boolean", default: false },
          isPublished: { type: "boolean", default: true },
        },
      },
      UpdatePropertyRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          address: { type: "string" },
          area: { type: "string" },
          city: { type: "string" },
          latitude: { type: "number" },
          longitude: { type: "number" },
          floorLabel: { type: "string" },
          totalFloors: { type: "integer" },
          totalUnits: { type: "integer" },
          unitsPerFloor: { type: "integer" },
          startingPrice: { type: "number" },
          handoverDate: { type: "string", format: "date-time" },
          landArea: { type: "string" },
          facing: { type: "string" },
          roadSize: { type: "string" },
          parkingAvailable: { type: "boolean" },
          liftAvailable: { type: "boolean" },
          generatorBackup: { type: "boolean" },
          securityAvailable: { type: "boolean" },
          imageUrls: { type: "array", items: { type: "string" } },
          amenities: { type: "array", items: { type: "string" } },
          status: { type: "string" },
          isFeatured: { type: "boolean" },
          isPublished: { type: "boolean" },
        },
      },
      PropertyResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Property operation successful" },
          data: {
            $ref: "#/components/schemas/Property",
          },
        },
      },
      PropertyListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Properties retrieved successfully" },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              total: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Property",
            },
          },
        },
      },
    },
  },
};
