"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEntry = writeEntry;
exports.getEntry = getEntry;
exports.dopplerCliInstalled = dopplerCliInstalled;
exports.writeDopplerCliInstalled = writeDopplerCliInstalled;
var node_cache_1 = __importDefault(require("node-cache"));
var cache = new node_cache_1.default({ stdTTL: 60 * 60 });
function writeEntry(ref, value) {
    return cache.set(ref, value);
}
function getEntry(ref) {
    return cache.get(ref);
}
function dopplerCliInstalled() {
    return cache.get('dopplerCliInstalled');
}
function writeDopplerCliInstalled(installed) {
    return cache.set('dopplerCliInstalled', installed);
}
