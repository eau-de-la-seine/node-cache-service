import cache from './index';

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

describe('index', () => {
  it('Nominal case', async () => {
    // GIVEN
    const superCalculatorService = new SuperCalculatorService();

    // WHEN
    const cachedService = cache(superCalculatorService);

    // THEN
    const callNumber1 = cachedService.method1('abc');
    const callNumber2 = cachedService.method1('abc');
    const callNumber3 = cachedService.method1('def');
    const callNumber4 = cachedService.method1();
    const callNumber5 = cachedService.method1();
    const callNumber6 = await cachedService.method2('ghi');
    const callNumber7 = await cachedService.method2('ghi');
    const callNumber8 = await cachedService.method2('abc');
    const callNumber9 = await cachedService.method2();
    const callNumber10 = await cachedService.method2();

    expect(callNumber1).toEqual(1);
    expect(callNumber2).toEqual(1);
    expect(callNumber3).toEqual(2);
    expect(callNumber4).toEqual(3);
    expect(callNumber5).toEqual(3);
    expect(callNumber6).toEqual(4);
    expect(callNumber7).toEqual(4);
    expect(callNumber8).toEqual(5);
    expect(callNumber9).toEqual(6);
    expect(callNumber10).toEqual(6);
  });

  it('Error case - unknown method', () => {
    // GIVEN
    const superCalculatorService = new SuperCalculatorService();

    // WHEN
    const cachedService = cache(superCalculatorService);

    // THEN
    expect(() => {
      // eslint-disable-next-line
      cachedService['unknownMethod']();
    }).toThrow(new Error("Method 'unknownMethod' not found!"));
  });

  it('Error case - must be a method', () => {
    // GIVEN
    const superCalculatorService = new SuperCalculatorService();
    superCalculatorService.counter = 1;

    // WHEN
    const cachedService = cache(superCalculatorService);

    // THEN
    expect(() => {
      cachedService.counter;
    }).toThrow(new Error('Must call a Function or an AsyncFunction!'));
  });
});
