"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 7]);
                    // Registrar Roles
                    return [4 /*yield*/, registrarRoles()];
                case 1:
                    // Registrar Roles
                    _a.sent();
                    // Registrar Administrador
                    return [4 /*yield*/, registrarAdministrador()];
                case 2:
                    // Registrar Administrador
                    _a.sent();
                    // Registrar Precios
                    return [4 /*yield*/, registrarTipoCambio()];
                case 3:
                    // Registrar Precios
                    _a.sent();
                    console.log("Seed data inserted successfully!");
                    return [3 /*break*/, 7];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error during seed:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, prisma.$disconnect()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function registrarRoles() {
    return __awaiter(this, void 0, void 0, function () {
        var roles, _i, roles_1, nombre, rolExiste;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roles = ["administrador", "colaborador"];
                    _i = 0, roles_1 = roles;
                    _a.label = 1;
                case 1:
                    if (!(_i < roles_1.length)) return [3 /*break*/, 5];
                    nombre = roles_1[_i];
                    return [4 /*yield*/, prisma.rol.findUnique({
                            where: { nombre: nombre },
                        })];
                case 2:
                    rolExiste = _a.sent();
                    if (!!rolExiste) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.rol.create({
                            data: { nombre: nombre },
                        })];
                case 3:
                    _a.sent();
                    console.log("Rol '".concat(nombre, "' registrado."));
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function registrarAdministrador() {
    return __awaiter(this, void 0, void 0, function () {
        var hashPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.hash("Assessor@2025", 10)];
                case 1:
                    hashPassword = _a.sent();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                nombres: "Assessor",
                                apellidos: "Perú",
                                celular: "987645321",
                                email: "administrador@assessorperu.com",
                                password: hashPassword,
                                rolId: 1,
                            },
                        })];
                case 2:
                    _a.sent();
                    console.log("Administrador Creado");
                    return [2 /*return*/];
            }
        });
    });
}
function registrarTipoCambio() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.tipoCambio.create({
                        data: {
                            precioCompra: new client_1.Prisma.Decimal(3.65),
                            precioVenta: new client_1.Prisma.Decimal(3.7),
                            intervaloCompra: new client_1.Prisma.Decimal(0.005),
                            intervaloVenta: new client_1.Prisma.Decimal(0.005),
                            moneda: "USD",
                        },
                    })];
                case 1:
                    _a.sent();
                    console.log("Tipo de Cambio Registrado");
                    return [2 /*return*/];
            }
        });
    });
}
main();
