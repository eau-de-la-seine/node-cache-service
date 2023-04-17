import NodeCache from 'node-cache';

const cache = <SERVICE extends object>(service: SERVICE, nodeCache: NodeCache = new NodeCache()): SERVICE => {
  const handler: ProxyHandler<SERVICE> = {
    get(originalService: SERVICE, methodName: string): any {
      const originalMethod = originalService[methodName];
      if (!originalMethod) {
        throw new Error(`Method '${methodName}' not found!`);
      }
      const isAsyncFunction = originalMethod.constructor.name === 'AsyncFunction';
      if (isAsyncFunction) {
        return async function (...args: any[]) {
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
        return function (...args: any[]) {
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

  // Setting the prototype from the original service in order to solve problems related to mock libraries (jest, sinon etc)
  return Object.setPrototypeOf(new Proxy(service, handler), Object.getPrototypeOf(service));
};

export default cache;
