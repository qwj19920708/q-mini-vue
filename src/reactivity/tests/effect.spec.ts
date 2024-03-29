import { effect, stop } from '../effect'
import { reactive } from '../reactive';

describe('effect', () => {
  it("happy path", () => {
    const user = reactive({
      age: 10
    });

    let nextAge;

    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    user.age++;

    expect(nextAge).toBe(12);
  });

  it("runner", () => {
    let foo = 10;
    const runner = effect(() => {
      foo ++

      return "foo"
    })

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    let dummy;
    // let run: any;
    const scheduler = jest.fn();
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    runner();
    // // should have run
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop += 1;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    let dummy = 0;
    const onStop = jest.fn(() => dummy = 1);
    const runner = effect(() => {}, {
      onStop,
    });

    stop(runner);
    expect(dummy).toBe(1);
    expect(onStop).toHaveBeenCalled();
  });
})