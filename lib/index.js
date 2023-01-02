"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const cache = (service, nodeCache = new node_cache_1.default()) => {
    const handler = {
        get(originalService, methodName) {
            const originalMethod = originalService[methodName];
            if (!originalMethod) {
                throw new Error(`Method '${methodName}' not found!`);
            }
            const isAsyncFunction = originalMethod.constructor.name === 'AsyncFunction';
            if (isAsyncFunction) {
                return async function (...args) {
                    const key = JSON.stringify([methodName, args]);
                    if (nodeCache.has(key)) {
                        return Promise.resolve(nodeCache.get(key));
                    }
                    const result = await originalMethod.apply(originalService, args);
                    nodeCache.set(key, result);
                    return result;
                };
            }
            const isFunction = originalMethod.constructor.name === 'Function';
            if (isFunction) {
                return function (...args) {
                    const key = JSON.stringify([methodName, args]);
                    if (nodeCache.has(key)) {
                        return nodeCache.get(key);
                    }
                    const result = originalMethod.apply(originalService, args);
                    nodeCache.set(key, result);
                    return result;
                };
            }
            throw new Error('Must call a Function or an AsyncFunction!');
        },
    };
    return new Proxy(service, handler);
};
exports.default = cache;
