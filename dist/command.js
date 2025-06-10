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
exports.runCommand = runCommand;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function findExecutablePath(command) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const commandWithExt = process.platform === 'win32' ? `${command}.exe` : command;
        const searchPaths = [];
        const homeDir = process.env.HOME || process.env.USERPROFILE || '';
        if (process.platform === 'win32') {
            searchPaths.push(process.env.ProgramFiles ? path.join(process.env.ProgramFiles, 'Doppler') : '', process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Doppler') : '', path.join('C:', 'ProgramData', 'Doppler', 'bin'));
        }
        else {
            searchPaths.push('/usr/local/bin', '/opt/homebrew/bin', '/usr/bin', '/bin', path.join(homeDir, '.local', 'bin'));
        }
        const pathDirs = ((_a = process.env.PATH) === null || _a === void 0 ? void 0 : _a.split(path.delimiter)) || [];
        const allPathsToSearch = [...new Set([...searchPaths, ...pathDirs])].filter(Boolean);
        for (const dir of allPathsToSearch) {
            const fullPath = path.join(dir, commandWithExt);
            try {
                yield fs.promises.access(fullPath, fs.constants.X_OK);
                console.log(`Executable found at: ${fullPath}`);
                return fullPath;
            }
            catch (error) {
            }
        }
        console.warn(`Executable '${command}' not found in any of the searched paths.`);
        return null;
    });
}
function runCommand(command, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const executablePath = yield findExecutablePath(command);
        if (!executablePath) {
            const errorMessage = `Command not found: '${command}'. Ensure it's installed and accessible.`;
            if (process.platform !== 'win32') {
                return Promise.reject(new Error(`/bin/sh: ${command}: command not found`));
            }
            return Promise.reject(new Error(errorMessage));
        }
        return new Promise((resolve, reject) => {
            console.log(`Executing: ${executablePath} ${args.join(' ')}`);
            const child = (0, child_process_1.spawn)(executablePath, args);
            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            child.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout.trim());
                }
                else {
                    const error = new Error(`Command failed with exit code ${code}: ${executablePath} ${args.join(' ')}\n\nStderr:\n${stderr.trim()}`);
                    reject(error);
                }
            });
            child.on('error', (err) => {
                reject(new Error(`Failed to start command: ${err.message}`));
            });
        });
    });
}
