import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origianl = {
      foo : 1
    };

    const observed = reactive(origianl);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(origianl)).toBe(false);
    expect(observed).not.toBe(origianl);
    expect(observed.foo).toBe(1);
  });
});