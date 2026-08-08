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
            description: "Invalid credentials",
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
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Get Current User Profile",
        description: "Retrieve profile information of the currently authenticated user.",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
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
    "/auth/forgot-password": {
      post: {
        summary: "Request Password Reset OTP",
        description: "Request a 6-digit OTP code sent via email for password recovery.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ForgotPasswordRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OTP email sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "An OTP reset code and link have been sent to your email address." },
                  },
                },
              },
            },
          },
          "404": {
            description: "No account found with this email address",
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
    "/auth/reset-password": {
      post: {
        summary: "Reset Password With OTP",
        description: "Verify 6-digit OTP code and set a new password.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Password has been successfully reset. You can now log in." },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid or expired OTP code",
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
          { name: "status", in: "query", description: "Filter by property status", schema: { type: "string" } },
          { name: "isFeatured", in: "query", description: "Filter by featured status", schema: { type: "boolean" } },
          { name: "page", in: "query", description: "Page number", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", description: "Records per page", schema: { type: "integer", default: 10 } },
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
    "/flats": {
      get: {
        summary: "Get All Flats",
        description: "Retrieve a paginated list of flats with search, filters (propertyId, beds, baths, price range, status, isFeatured), and sorting.",
        tags: ["Flats"],
        parameters: [
          { name: "search", in: "query", description: "Search by flat title or flat number", schema: { type: "string" } },
          { name: "propertyId", in: "query", description: "Filter by property UUID", schema: { type: "string", format: "uuid" } },
          { name: "beds", in: "query", description: "Filter by bedroom count", schema: { type: "integer" } },
          { name: "baths", in: "query", description: "Filter by bathroom count", schema: { type: "integer" } },
          { name: "minPrice", in: "query", description: "Minimum price", schema: { type: "number" } },
          { name: "maxPrice", in: "query", description: "Maximum price", schema: { type: "number" } },
          { name: "status", in: "query", description: "Filter status", schema: { type: "string", enum: ["AVAILABLE", "BOOKED", "SOLD"] } },
          { name: "isFeatured", in: "query", description: "Filter featured flats", schema: { type: "boolean" } },
          { name: "page", in: "query", description: "Page number", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", description: "Records per page", schema: { type: "integer", default: 10 } },
          { name: "sortBy", in: "query", description: "Field to sort by", schema: { type: "string", default: "createdAt" } },
          { name: "sortOrder", in: "query", description: "Sort order", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          "200": {
            description: "Flats retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FlatListResponse",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create Flat",
        description: "Add a new flat under a property. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Flats"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateFlatRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Flat created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FlatResponse",
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
          "404": {
            description: "Target property not found",
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
    "/flats/{id}": {
      get: {
        summary: "Get Single Flat",
        description: "Retrieve details of a single flat by ID, including nested parent property information.",
        tags: ["Flats"],
        parameters: [
          { name: "id", in: "path", required: true, description: "Flat UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Flat retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FlatResponse",
                },
              },
            },
          },
          "404": {
            description: "Flat not found",
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
        summary: "Update Flat",
        description: "Modify dynamic attributes of a flat. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Flats"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Flat UUID", schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateFlatRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Flat updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FlatResponse",
                },
              },
            },
          },
          "404": {
            description: "Flat not found",
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
        summary: "Delete Flat",
        description: "Hard-delete a flat from database. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Flats"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Flat UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Flat deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Flat deleted successfully" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Flat not found",
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
    "/bookings": {
      post: {
        summary: "Create Flat Booking Request",
        description: "Initiate a booking request for an available flat. Supports SSLCOMMERZ, BANK_TRANSFER, BKASH, NAGAD, and CASH payment methods.",
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBookingRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Flat booking request created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateBookingResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid input or flat is already booked/sold",
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
            description: "Target flat not found",
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
      get: {
        summary: "Get All Bookings (Admin/Staff)",
        description: "Retrieve all booking records across the platform. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "All bookings retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingListResponse",
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
          "403": {
            description: "Forbidden",
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
    "/bookings/my-bookings": {
      get: {
        summary: "Get Current User's Bookings",
        description: "Retrieve all booking requests submitted by the currently logged-in customer.",
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User bookings fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingListResponse",
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
    "/bookings/{id}/verify-payment": {
      patch: {
        summary: "Verify/Update Booking Payment (Admin/Staff)",
        description: "Approve or reject a booking payment. Approving sets status to CONFIRMED and flat to BOOKED. Rejecting sets status to CANCELLED and flat to AVAILABLE. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Bookings"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Booking UUID", schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateBookingStatusRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Booking payment status updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid action or parameters",
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
            description: "Booking record not found",
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
    "/payments/ssl-success": {
      post: {
        summary: "SSLCommerz Payment Success Callback (POST)",
        description: "Callback URL invoked by SSLCommerz upon successful payment completion. Validates payment transaction and updates booking and payment records to VALIDATED, then redirects user to frontend dashboard.",
        tags: ["Payments"],
        parameters: [
          { name: "val_id", in: "query", description: "SSLCommerz validation ID", schema: { type: "string" } },
          { name: "tranId", in: "query", description: "Transaction ID", schema: { type: "string" } },
          { name: "bookingId", in: "query", description: "Target Booking ID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "302": {
            description: "Redirects to frontend dashboard with payment status query parameter",
          },
        },
      },
      get: {
        summary: "SSLCommerz Payment Success Callback (GET)",
        description: "GET fallback URL for SSLCommerz payment success redirection.",
        tags: ["Payments"],
        parameters: [
          { name: "val_id", in: "query", description: "SSLCommerz validation ID", schema: { type: "string" } },
          { name: "tranId", in: "query", description: "Transaction ID", schema: { type: "string" } },
          { name: "bookingId", in: "query", description: "Target Booking ID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "302": {
            description: "Redirects to frontend dashboard with payment status query parameter",
          },
        },
      },
    },
    "/payments/ssl-fail": {
      post: {
        summary: "SSLCommerz Payment Failure Callback (POST)",
        description: "Callback URL invoked by SSLCommerz when payment fails. Updates payment status to FAILED and redirects user to frontend dashboard.",
        tags: ["Payments"],
        parameters: [
          { name: "tranId", in: "query", description: "Transaction ID", schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirects to frontend dashboard with payment=failed query parameter",
          },
        },
      },
      get: {
        summary: "SSLCommerz Payment Failure Callback (GET)",
        description: "GET fallback URL for SSLCommerz payment failure redirection.",
        tags: ["Payments"],
        parameters: [
          { name: "tranId", in: "query", description: "Transaction ID", schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirects to frontend dashboard with payment=failed query parameter",
          },
        },
      },
    },
    "/payments/ssl-cancel": {
      post: {
        summary: "SSLCommerz Payment Cancel Callback (POST)",
        description: "Callback URL invoked by SSLCommerz when customer cancels transaction. Reverts booking status to CANCELLED and flat status to AVAILABLE.",
        tags: ["Payments"],
        parameters: [
          { name: "tranId", in: "query", description: "Transaction ID", schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirects to frontend dashboard with payment=cancelled query parameter",
          },
        },
      },
      get: {
        summary: "SSLCommerz Payment Cancel Callback (GET)",
        description: "GET fallback URL for SSLCommerz payment cancellation redirection.",
        tags: ["Payments"],
        parameters: [
          { name: "tranId", in: "query", description: "Transaction ID", schema: { type: "string" } },
        ],
        responses: {
          "302": {
            description: "Redirects to frontend dashboard with payment=cancelled query parameter",
          },
        },
      },
    },
    "/payments/ssl-ipn": {
      post: {
        summary: "SSLCommerz Instant Payment Notification (IPN)",
        description: "Server-to-server IPN webhook endpoint from SSLCommerz.",
        tags: ["Payments"],
        responses: {
          "200": {
            description: "IPN notification acknowledged",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "IPN Received" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/media/upload": {
      post: {
        summary: "Upload Media File",
        description: "Upload an image file (JPEG, PNG, WebP, GIF, SVG up to 10MB) to Supabase cloud storage.",
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary", description: "Image file to upload" },
                  folder: { type: "string", default: "general", example: "properties", description: "Target storage folder" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "File uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MediaResponse",
                },
              },
            },
          },
          "400": {
            description: "No file provided or invalid file format",
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
    "/media": {
      get: {
        summary: "Get All Media Files",
        description: "Retrieve a paginated list of media files with optional folder and search filters.",
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", description: "Search filename", schema: { type: "string" } },
          { name: "folder", in: "query", description: "Filter by folder", schema: { type: "string" } },
          { name: "page", in: "query", description: "Page number", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", description: "Records per page", schema: { type: "integer", default: 10 } },
          { name: "sortBy", in: "query", description: "Field to sort by", schema: { type: "string", default: "createdAt" } },
          { name: "sortOrder", in: "query", description: "Sort order", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          "200": {
            description: "Media files retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MediaListResponse",
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
    "/media/{id}": {
      get: {
        summary: "Get Single Media File",
        description: "Retrieve metadata details of a single media record by ID.",
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Media UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Media record retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MediaResponse",
                },
              },
            },
          },
          "404": {
            description: "Media record not found",
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
        summary: "Delete Media File",
        description: "Delete a media file from cloud storage and remove its database record.",
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, description: "Media UUID", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Media deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Media deleted successfully" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Media record not found",
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
    "/media/bulk-delete": {
      post: {
        summary: "Bulk Delete Media Files (Admin/Staff)",
        description: "Delete multiple media files by array of IDs. Restricted to SUPER_ADMIN, ADMIN, or STAFF.",
        tags: ["Media"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BulkDeleteMediaRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Bulk media deletion completed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Successfully deleted 3 media file(s)" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Array of media IDs not provided",
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
      Flat: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          propertyId: { type: "string", format: "uuid" },
          title: { type: "string" },
          flatNumber: { type: "string" },
          floorNumber: { type: "integer" },
          beds: { type: "integer" },
          baths: { type: "integer" },
          kitchens: { type: "boolean" },
          balconies: { type: "integer" },
          size: { type: "number" },
          price: { type: "number" },
          status: { type: "string", enum: ["AVAILABLE", "BOOKED", "SOLD"] },
          description: { type: "string", nullable: true },
          imageUrls: { type: "array", items: { type: "string" } },
          amenities: { type: "array", items: { type: "string" } },
          isFeatured: { type: "boolean" },
          isPublished: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateFlatRequest: {
        type: "object",
        required: ["propertyId", "title", "flatNumber", "floorNumber", "size", "price"],
        properties: {
          propertyId: { type: "string", format: "uuid", example: "e2b3c4d5-6789-1011-1213-141516171819" },
          title: { type: "string", example: "Flat 4A - Deluxe Corner Unit" },
          flatNumber: { type: "string", example: "4A" },
          floorNumber: { type: "integer", example: 4 },
          beds: { type: "integer", default: 3, example: 3 },
          baths: { type: "integer", default: 3, example: 3 },
          kitchens: { type: "boolean", default: true, example: true },
          balconies: { type: "integer", default: 2, example: 2 },
          size: { type: "number", example: 1650.0 },
          price: { type: "number", example: 18500000.0 },
          status: { type: "string", enum: ["AVAILABLE", "BOOKED", "SOLD"], default: "AVAILABLE" },
          description: { type: "string", example: "Spacious 3-bedroom corner flat with lake view" },
          imageUrls: { type: "array", items: { type: "string" }, example: ["https://example.com/flat1.jpg"] },
          amenities: { type: "array", items: { type: "string" }, example: ["South Facing", "Corner Unit", "Gas Connection"] },
          isFeatured: { type: "boolean", default: false },
          isPublished: { type: "boolean", default: true },
        },
      },
      UpdateFlatRequest: {
        type: "object",
        properties: {
          propertyId: { type: "string", format: "uuid" },
          title: { type: "string" },
          flatNumber: { type: "string" },
          floorNumber: { type: "integer" },
          beds: { type: "integer" },
          baths: { type: "integer" },
          kitchens: { type: "boolean" },
          balconies: { type: "integer" },
          size: { type: "number" },
          price: { type: "number" },
          status: { type: "string", enum: ["AVAILABLE", "BOOKED", "SOLD"] },
          description: { type: "string" },
          imageUrls: { type: "array", items: { type: "string" } },
          amenities: { type: "array", items: { type: "string" } },
          isFeatured: { type: "boolean" },
          isPublished: { type: "boolean" },
        },
      },
      FlatResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Flat operation successful" },
          data: {
            $ref: "#/components/schemas/Flat",
          },
        },
      },
      FlatListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Flats retrieved successfully" },
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
              $ref: "#/components/schemas/Flat",
            },
          },
        },
      },
      ForgotPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email", "otpCode", "newPassword"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          otpCode: { type: "string", example: "123456" },
          newPassword: { type: "string", example: "NewSecurePassword123!" },
        },
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          tranId: { type: "string", example: "TXN-20260801-1234" },
          bookingId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          paymentMethod: { type: "string", enum: ["SSLCOMMERZ", "BANK_TRANSFER", "BKASH", "NAGAD", "CASH"], example: "BANK_TRANSFER" },
          amount: { type: "number", example: 500000 },
          currency: { type: "string", example: "BDT" },
          valId: { type: "string", nullable: true },
          cardType: { type: "string", nullable: true },
          bankTranId: { type: "string", nullable: true },
          senderAccount: { type: "string", nullable: true },
          receiptUrl: { type: "string", nullable: true },
          status: { type: "string", enum: ["PENDING_APPROVAL", "VALIDATED", "REJECTED", "FAILED", "CANCELLED"], example: "PENDING_APPROVAL" },
          adminNotes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          bookingNumber: { type: "string", example: "BK-20260801-1234" },
          userId: { type: "string", format: "uuid" },
          flatId: { type: "string", format: "uuid" },
          customerName: { type: "string", example: "John Doe" },
          customerEmail: { type: "string", format: "email", example: "john@example.com" },
          customerPhone: { type: "string", example: "+8801700000000" },
          bookingAmount: { type: "number", example: 500000 },
          paidAmount: { type: "number", example: 500000 },
          paymentStatus: { type: "string", enum: ["PENDING_APPROVAL", "VALIDATED", "REJECTED"], example: "PENDING_APPROVAL" },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"], example: "PENDING" },
          notes: { type: "string", nullable: true },
          adminNotes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          flat: {
            $ref: "#/components/schemas/Flat",
          },
          payments: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Payment",
            },
          },
        },
      },
      CreateBookingRequest: {
        type: "object",
        required: ["flatId", "customerName", "customerEmail", "customerPhone", "bookingAmount"],
        properties: {
          flatId: { type: "string", format: "uuid", example: "e2b3c4d5-6789-1011-1213-141516171819" },
          customerName: { type: "string", example: "John Doe" },
          customerEmail: { type: "string", format: "email", example: "john@example.com" },
          customerPhone: { type: "string", example: "+8801700000000" },
          bookingAmount: { type: "number", example: 500000 },
          notes: { type: "string", example: "Requesting booking for flat 4A" },
          paymentMethod: { type: "string", enum: ["SSLCOMMERZ", "BANK_TRANSFER", "BKASH", "NAGAD", "CASH"], default: "BANK_TRANSFER", example: "BANK_TRANSFER" },
          senderAccount: { type: "string", example: "01700000000" },
          bankTranId: { type: "string", example: "TRX987654321" },
          receiptUrl: { type: "string", example: "https://example.com/receipt.pdf" },
        },
      },
      CreateBookingResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Flat booking request created successfully" },
          data: {
            type: "object",
            properties: {
              booking: {
                $ref: "#/components/schemas/Booking",
              },
              gatewayUrl: { type: "string", nullable: true, example: "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=..." },
              paymentMethod: { type: "string", example: "SSLCOMMERZ" },
            },
          },
        },
      },
      UpdateBookingStatusRequest: {
        type: "object",
        required: ["action"],
        properties: {
          action: { type: "string", enum: ["APPROVE", "REJECT"], example: "APPROVE" },
          adminNotes: { type: "string", example: "Bank deposit verified and confirmed" },
        },
      },
      BookingResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Booking operation successful" },
          data: {
            $ref: "#/components/schemas/Booking",
          },
        },
      },
      BookingListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Bookings fetched successfully" },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Booking",
            },
          },
        },
      },
      Media: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          filename: { type: "string", example: "1722510000000-apartment.jpg" },
          originalName: { type: "string", example: "apartment.jpg" },
          mimeType: { type: "string", example: "image/jpeg" },
          size: { type: "integer", example: 245000 },
          url: { type: "string", example: "https://xyz.supabase.co/storage/v1/object/public/real-estate/general/1722510000000-apartment.jpg" },
          folder: { type: "string", example: "general" },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      MediaResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "File uploaded successfully" },
          data: {
            $ref: "#/components/schemas/Media",
          },
        },
      },
      MediaListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Media retrieved successfully" },
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
              $ref: "#/components/schemas/Media",
            },
          },
        },
      },
      BulkDeleteMediaRequest: {
        type: "object",
        required: ["ids"],
        properties: {
          ids: {
            type: "array",
            items: { type: "string", format: "uuid" },
            example: ["e2b3c4d5-6789-1011-1213-141516171819"],
          },
        },
      },
    },
  },
};
