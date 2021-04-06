import { Attrs } from '../../types'
import { DomUtil } from '../../util/dom'
import { Box } from '../../struct/box'
import { UnitNumber } from '../../struct/unit-number'
import { VectorElement } from '../element'
import { Container } from './container'
import { Stop } from './gradient-stop'

@Gradient.register('Gradient')
export class Gradient extends Container<
  SVGLinearGradientElement | SVGRadialGradientElement
> {
  constructor(
    type: Gradient.Type | SVGLinearGradientElement | SVGRadialGradientElement,
    attrs?: Attrs,
  ) {
    super(
      typeof type === 'string'
        ? DomUtil.createNode<
            SVGLinearGradientElement | SVGRadialGradientElement
          >(`${type}Gradient`)
        : type,
      attrs,
    )
  }

  from(x: number | string, y: number | string) {
    return this.type === 'radialGradient'
      ? this.attr({
          fx: UnitNumber.create(x).toString(),
          fy: UnitNumber.create(y).toString(),
        })
      : this.attr({
          x1: UnitNumber.create(x).toString(),
          y1: UnitNumber.create(y).toString(),
        })
  }

  to(x: number | string, y: number | string) {
    return this.type === 'radialGradient'
      ? this.attr({
          cx: UnitNumber.create(x).toString(),
          cy: UnitNumber.create(x).toString(),
        })
      : this.attr({
          x2: UnitNumber.create(y).toString(),
          y2: UnitNumber.create(y).toString(),
        })
  }

  stop(
    offset?: number | string | UnitNumber,
    color?: string,
    opacity?: number | string | UnitNumber,
  ): Stop
  stop(options: Stop.Options): Stop
  stop(
    offset?: Stop.Options | number | string | UnitNumber,
    color?: string,
    opacity?: number | string | UnitNumber,
  ) {
    return new Stop().update(offset, color, opacity).appendTo(this)
  }

  attr(): Attrs
  attr(names: string[]): Attrs
  attr<T extends number | string = string>(name: string): T
  attr(name: string, value: null): this
  attr(name: string, value: number | string, ns?: string): this
  attr(attrs: Attrs): this
  attr<T extends number | string>(
    name?: string,
    value?: number | string | null,
    ns?: string,
  ): T | this
  attr(
    attr?: string | string[] | Attrs,
    value?: number | string | null,
    ns?: string,
  ) {
    return super.attr(
      attr === 'transform' ? 'gradientTransform' : attr,
      value,
      ns,
    )
  }

  bbox() {
    return new Box()
  }

  targets<TVector extends VectorElement>() {
    return Gradient.find<TVector>(`svg [fill*="${this.id()}"]`)
  }

  update(handler?: Gradient.Update | null) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
  }

  url() {
    return `url("#${this.id()}")`
  }

  toString() {
    return this.url()
  }
}

export namespace Gradient {
  export type Type = 'linear' | 'radial'
  export type Update = (this: Gradient, gradient: Gradient) => void

  export function create(type: Type, attrs?: Attrs | null): Gradient
  export function create(
    type: Type,
    update: Update,
    attrs?: Attrs | null,
  ): Gradient
  export function create(
    type: Type,
    update?: Update | Attrs | null,
    attrs?: Attrs | null,
  ): Gradient
  export function create(
    type: Type,
    update?: Update | Attrs | null,
    attrs?: Attrs | null,
  ) {
    const gradient = new Gradient(type)
    if (update) {
      if (typeof update === 'function') {
        gradient.update(update)
        if (attrs) {
          gradient.attr(attrs)
        }
      } else {
        gradient.attr(update)
      }
    } else if (attrs) {
      gradient.attr(attrs)
    }
    return gradient
  }
}
