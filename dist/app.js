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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.templateTags = void 0;
var child_process_1 = require("child_process");
var cache = __importStar(require("./cache"));
var fetchSecretTemplateTag = {
    name: 'dopplersecret',
    displayName: 'Doppler => Fetch Secret',
    liveDisplayName: function (args) {
        var _a, _b, _c, _d, _e, _f;
        return "Doppler => ".concat((_b = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '--', " => ").concat((_d = (_c = args[1]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : '--', " => ").concat((_f = (_e = args[2]) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : '--');
    },
    description: 'Fetch a secret from your Doppler Config',
    args: [
        {
            displayName: 'project',
            description: 'Doppler Project Name',
            type: 'string',
            defaultValue: 'pit',
            placeholder: 'e.g. web-frontend',
        },
        {
            displayName: 'config',
            description: 'Doppler Config Name',
            type: 'string',
            defaultValue: 'prd',
            placeholder: 'e.g. prd_config',
        },
        {
            displayName: 'secret',
            description: 'Doppler Secret Name',
            type: 'string',
            defaultValue: '',
            placeholder: 'e.g. API_KEY',
        },
    ],
    run: function (context, project, config, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, checkCli()];
                    case 1:
                        _a.sent();
                        return [4, fetchEntry(project, config, secret)];
                    case 2:
                        entry = _a.sent();
                        return [2, entry];
                }
            });
        });
    },
};
function checkCli() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(cache.dopplerCliInstalled() !== true)) return [3, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, new Promise(function (resolve, reject) {
                            (0, child_process_1.exec)('doppler me --json', function (error, stdout, stderr) {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                if (stderr) {
                                    reject(new Error(stderr));
                                    return;
                                }
                                var result = JSON.parse(stdout);
                                if (!result.name) {
                                    reject(new Error('Doppler CLI is not installed or not logged in'));
                                    return;
                                }
                                resolve(result);
                            });
                        })];
                case 2:
                    _a.sent();
                    cache.writeDopplerCliInstalled(true);
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    if (e_1 instanceof Error) {
                        err = new Error("There was an issue with the Doppler CLI. If you have the Doppler CLI installed run doppler login. Error details: ".concat(e_1.message));
                        err.stack = e_1.stack;
                        throw err;
                    }
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
function fetchEntry(project, config, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, existing, secretValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "".concat(project, ":").concat(config, "-").concat(secret);
                    existing = cache.getEntry(cacheKey);
                    if (existing) {
                        return [2, existing];
                    }
                    return [4, new Promise(function (resolve, reject) {
                            (0, child_process_1.exec)("doppler secrets get --project ".concat(project, " --config ").concat(config, " --json ").concat(secret), function (error, stdout, stderr) {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                if (stderr) {
                                    reject(new Error(stderr));
                                    return;
                                }
                                var result = JSON.parse(stdout);
                                if (!Object.keys(result).includes(secret)) {
                                    reject(new Error('Secret Value not found'));
                                    return;
                                }
                                resolve(result[secret].computed);
                            });
                        })];
                case 1:
                    secretValue = _a.sent();
                    cache.writeEntry(cacheKey, secretValue);
                    return [2, secretValue];
            }
        });
    });
}
exports.templateTags = [fetchSecretTemplateTag];
