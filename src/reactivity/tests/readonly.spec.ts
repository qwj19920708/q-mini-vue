import { readonly, isReadonly, isProxy } from '../reactive'

describe("readonly", () => {
  it("happy path", () => {
    const origianl = {
      foo: 1,
      bar: {
        baz: 2
      }
    };
    const wrapped = readonly(origianl);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isProxy(wrapped)).toBe(true)
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(wrapped).not.toBe(origianl);
    expect(wrapped.foo).toBe(1);
  })
})