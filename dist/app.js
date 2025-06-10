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
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateTags = void 0;
const cache = __importStar(require("./cache"));
const doppler_1 = require("./doppler");
const fetchSecretTemplateTag = {
    name: 'dopplersecret',
    displayName: 'Doppler => Fetch Secret',
    liveDisplayName: (args) => {
        var _a, _b, _c, _d, _e, _f;
        return `Doppler => ${(_b = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '--'} => ${(_d = (_c = args[1]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : '--'} => ${(_f = (_e = args[2]) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : '--'}`;
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
    run(context, project, config, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkCli();
            const entry = yield fetchEntry(project, config, secret);
            return entry;
        });
    },
};
function checkCli() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cache.dopplerCliInstalled() !== true) {
            const dopplerInstalled = yield (0, doppler_1.dopplerCliInstalled)();
            cache.writeDopplerCliInstalled(dopplerInstalled);
        }
    });
}
function fetchEntry(project, config, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `${project}:${config}-${secret}`;
        const existing = cache.getEntry(cacheKey);
        if (existing) {
            return existing;
        }
        const secretValue = yield (0, doppler_1.getSecret)(project, config, secret);
        cache.writeEntry(cacheKey, secretValue);
        return secretValue;
    });
}
exports.templateTags = [fetchSecretTemplateTag];
