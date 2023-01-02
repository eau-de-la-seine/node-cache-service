import NodeCache from 'node-cache';
declare const cache: <SERVICE extends object>(service: SERVICE, nodeCache?: NodeCache) => SERVICE;
export default cache;
