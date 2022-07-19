import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export const reactive = (raw) => {
  return new Proxy(raw, mutableHandlers);
}

export const readonly = (raw) => {
  return new Proxy(raw, readonlyHandlers)
}