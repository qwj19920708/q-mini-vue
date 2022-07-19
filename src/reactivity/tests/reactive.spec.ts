import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origianl = {
      foo : 1
    };

    const observed = reactive(origianl);

    expect(observed).not.toBe(origianl);
    expect(observed.foo).toBe(1);
  });
});