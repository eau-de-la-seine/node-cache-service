# `node-cache-service`

Description: This library offers a `cache()` function that proxifies your service's method calls

Notes:
* This library works with `async` and non-`async` methods
* This library uses [`node-cache`](https://github.com/node-cache/node-cache) as an implementation, by default TTL is disabled, but you can provide your own configured `NodeCache` object as the second argument of `cache()`
* This library does not support eviction yet (maybe later)
* For Java developpers, it works like Spring's `@Cacheable` annotation on a class (aka bean)



## How to use this library

Example:
```js
import cache from 'node-cache-service/index';

class SuperCalculatorService {
  // Mutable attribute for demo
  counter: number = 0;

  method1(someArg?: string): number {
    return ++this.counter;
  }

  async method2(someArg?: string): Promise<number> {
    return ++this.counter;
  }
}

// Initialize your service
const superCalculatorService = new SuperCalculatorService();

// Cache your service
const cachedService = cache(superCalculatorService);

// Call your methods
const callNumber1 = cachedService.method1('call');                // 1
const callNumber2 = cachedService.method1('call');                // 1
const callNumber3 = cachedService.method1('call number 3');       // 2
const callNumber4 = await cachedService.method2('call');          // 3
const callNumber5 = await cachedService.method2('call');          // 3
const callNumber6 = await cachedService.method2('call number 6'); // 4
```
