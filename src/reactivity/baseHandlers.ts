import { extend, isObject } from '../shared';
import { track, trigger } from './effect';
import { reactive, ReactiveFlags, readonly } from './reactive';

const createGetter = (isReadonly = false, shadow = false) => {
  return function get (target, key) {

    if (key === ReactiveFlags.ISREACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.ISREADONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key);

    if (shadow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    // TODO 依赖收集
    if (!isReadonly) {
      track(target, key);
    };
    
    return res;
  }
}

const createSetter = () => {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    // TODO 触发依赖
    trigger(target, key);
    return res;
  }
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shadowReadonlyGet =  createGetter(true, true)

export const mutableHandlers = {
  get: get,
  set: set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: (target, key) => {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true
  }
}

export const shallowReadonlyHandlers = {
  get: shadowReadonlyGet,
  set: (target, key) => {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true
  }
}