import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
  ISREACTIVE = '__v_isReactive',
  ISREADONLY = '__v_isReadonly'
} 

const createActiveObject = (raw, handlers) => {
  return new Proxy(raw, handlers)
}

export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers);
}

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers);
}

export const isReadonly = (wrap) => {
  return !!wrap[ReactiveFlags.ISREADONLY]
}

export const isReactive = (observed) => {
  return !!observed[ReactiveFlags.ISREACTIVE]
}