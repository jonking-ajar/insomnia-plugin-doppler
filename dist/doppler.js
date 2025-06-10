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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = exports.dopplerCliInstalled = void 0;
const command_1 = require("./command");
const dopplerCliInstalled = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const me = yield (0, command_1.runCommand)('doppler', ['me', '--json']);
        const result = JSON.parse(me);
        if (!result.name) {
            throw new Error('Doppler CLI is not installed or not logged in');
        }
        return true;
    }
    catch (e) {
        if (e instanceof Error) {
            const err = new Error(`There was an issue with the Doppler CLI. If you have the Doppler CLI installed run doppler login. Error details: ${e.message}`);
            err.stack = e.stack;
            throw err;
        }
    }
    return false;
});
exports.dopplerCliInstalled = dopplerCliInstalled;
const getSecret = (project, config, secret) => __awaiter(void 0, void 0, void 0, function* () {
    const secretValue = yield (0, command_1.runCommand)('doppler', [
        'secrets',
        'get',
        '--project',
        project,
        '--config',
        config,
        '--json',
        secret,
    ]);
    const result = JSON.parse(secretValue);
    if (!Object.keys(result).includes(secret)) {
        throw new Error('Secret Value not found');
    }
    return result[secret].computed;
});
exports.getSecret = getSecret;
