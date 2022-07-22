import { hasChanged, isObject } from "../shared"
import { trackEffect, triggerEffect, isTracking } from "./effect"
import { reactive } from "./reactive"

const trackRefEffect = (ref) => {
  if (isTracking()) {
    trackEffect(ref.dep)
  }
}

const convert = (value) => {
  return isObject(value) ? reactive(value) : value
}

class RefImpl {
  private _value: any
  public dep
  public raw
  public __v_isRef = true
  constructor(value){
    this.raw = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value () {
    trackRefEffect(this)
    return this._value
  }

  set value(newValue) {
    if (hasChanged(this.raw, newValue)) {
      this.raw = newValue
      this._value = convert(newValue)
      triggerEffect(this.dep)
    }
  }
}

export const ref = (value) => {
  return new RefImpl(value)
}

export const isRef = (value) => {
  return false
}

export const unRef = () => {

}