import { Defs } from '../../../element/container/defs'
import { SVGAnimator } from '../svg'

@SVGDefsAnimator.register('Defs')
export class SVGDefsAnimator extends SVGAnimator<SVGDefsElement, Defs> {}
