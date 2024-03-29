let activeEffect;
let shouldTrack;
class ReactiveEffect {
  private _fn: any
  private active: Boolean
  public deps: Array<any>
  public scheduler: Function | undefined
  public onStop: Function | undefined
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler

    this.deps = []
    this.active = true
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    activeEffect = this
    shouldTrack = true
    const result = this._fn()
    shouldTrack = false
    return result
  }

  stop() {
    if (this.active) {
      this.active = false;
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
    }
  }
}

const cleanupEffect = (effect) => {
  effect.deps.forEach(dep=> {
    dep.delete(effect)
  });
}

const targetMap = new Map();

export const isTracking = () => {
  return activeEffect !== undefined && shouldTrack
}

export const trackEffect = (dep) => {
  if (!dep.has(activeEffect))
    dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export const track = (target, key) => {
  if (!isTracking())
    return

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffect(dep)
  
}

export const triggerEffect = (dep) => {
  for(const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
} 

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffect(dep)
}

export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  _effect.onStop = options.onStop;

  _effect.run();

  const runner:any = _effect.run.bind(_effect)

  runner.effect = _effect;

  return runner;
}

export const stop = (runner) => {
  runner.effect.stop();
}