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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.getSessionTokenFromRequest = exports.verifySessionToken = exports.createSessionToken = exports.verifyPassword = exports.hashPassword = void 0;
var node_crypto_1 = require("node:crypto");
var node_util_1 = require("node:util");
var jose_1 = require("jose");
var cookie_1 = require("cookie");
var const_1 = require("@shared/const");
var env_1 = require("./env");
var scrypt = (0, node_util_1.promisify)(node_crypto_1.scrypt);
var KEY_LENGTH = 64;
/** Hash a plaintext password with a random salt. Format: `salt:hash` (hex). */
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, derivedKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    salt = (0, node_crypto_1.randomBytes)(16).toString("hex");
                    return [4 /*yield*/, scrypt(password, salt, KEY_LENGTH)];
                case 1:
                    derivedKey = (_a.sent());
                    return [2 /*return*/, "".concat(salt, ":").concat(derivedKey.toString("hex"))];
            }
        });
    });
}
exports.hashPassword = hashPassword;
/** Verify a plaintext password against a stored `salt:hash` string. */
function verifyPassword(password, storedHash) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, salt, hashHex, derivedKey, storedBuffer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = storedHash.split(":"), salt = _a[0], hashHex = _a[1];
                    if (!salt || !hashHex)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, scrypt(password, salt, KEY_LENGTH)];
                case 1:
                    derivedKey = (_b.sent());
                    storedBuffer = Buffer.from(hashHex, "hex");
                    if (storedBuffer.length !== derivedKey.length)
                        return [2 /*return*/, false];
                    return [2 /*return*/, (0, node_crypto_1.timingSafeEqual)(derivedKey, storedBuffer)];
            }
        });
    });
}
exports.verifyPassword = verifyPassword;
function getSecretKey() {
    if (!env_1.ENV.cookieSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return new TextEncoder().encode(env_1.ENV.cookieSecret);
}
/** Create a signed JWT session token for a user. */
function createSessionToken(userId, expiresInMs // 1 year
) {
    if (expiresInMs === void 0) { expiresInMs = 1000 * 60 * 60 * 24 * 365; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new jose_1.SignJWT({ userId: userId })
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime(Math.floor((Date.now() + expiresInMs) / 1000))
                    .sign(getSecretKey())];
        });
    });
}
exports.createSessionToken = createSessionToken;
/** Verify a session token and return its payload, or null if invalid/expired. */
function verifySessionToken(token) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, jose_1.jwtVerify)(token, getSecretKey())];
                case 1:
                    payload = (_b.sent()).payload;
                    if (typeof payload.userId !== "number")
                        return [2 /*return*/, null];
                    return [2 /*return*/, { userId: payload.userId }];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.verifySessionToken = verifySessionToken;
/** Extract the session token from the request's cookie or Authorization header. */
function getSessionTokenFromRequest(req) {
    var _a;
    var cookies = (0, cookie_1.parse)((_a = req.headers.cookie) !== null && _a !== void 0 ? _a : "");
    if (cookies[const_1.COOKIE_NAME])
        return cookies[const_1.COOKIE_NAME];
    var authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
        return authHeader.slice("Bearer ".length);
    }
    return undefined;
}
exports.getSessionTokenFromRequest = getSessionTokenFromRequest;
