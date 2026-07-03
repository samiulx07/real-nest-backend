"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const property_validation_1 = require("../validations/property.validation");
const propertyController = __importStar(require("../controllers/property.controller"));
const router = (0, express_1.Router)();
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.post("/", (0, auth_middleware_1.authMiddleware)("SUPER_ADMIN", "ADMIN", "STAFF"), (0, validate_middleware_1.validateRequest)(property_validation_1.createPropertySchema), propertyController.createProperty);
router.patch("/:id", (0, auth_middleware_1.authMiddleware)("SUPER_ADMIN", "ADMIN", "STAFF"), (0, validate_middleware_1.validateRequest)(property_validation_1.updatePropertySchema), propertyController.updateProperty);
router.delete("/:id", (0, auth_middleware_1.authMiddleware)("SUPER_ADMIN", "ADMIN", "STAFF"), propertyController.deleteProperty);
exports.default = router;
