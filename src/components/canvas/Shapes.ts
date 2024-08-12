import { Circle, CircleProps, Rect, RectProps, util } from 'fabric';
import { DeleteControl } from '@/components/canvas/controls';

const propertiesThatCanBeModified = [
    "fill",
    "left",
    "top",
    "width",
    "height",
    "scaleX",
    "scaleY",
    "skewX",
    "skewY",
    "rx",
    "ry",
    "angle"
]

export class CustomCircle extends Circle<{ id: string }> {
    specificModifiableProps = ['radius']

    constructor(options: Partial<CircleProps & { loaded?: boolean, id: string }> | undefined) {
        super({ id: crypto.randomUUID(), ...options });
        this.controls.deleteControl = new DeleteControl(() => this.canvas?.remove(this));
    }

    toDbRep(): any {
        return { type: (this.constructor as typeof CustomCircle).type, ...util.pick(this, [...propertiesThatCanBeModified, this.specificModifiableProps] as (keyof this)[]) }
    }
}


export class CustomRect extends Rect<{ loaded?: boolean, id: string }> {
    specificModifiableProps = ['width', 'height']

    constructor(options: Partial<RectProps & { loaded?: boolean,  id: string }> | undefined) {
        super({ id: crypto.randomUUID(), ...options });
        this.controls.deleteControl = new DeleteControl(() => this.canvas?.remove(this));
    }

    toDbRep(): any {
        return { type: (this.constructor as typeof CustomCircle).type, ...util.pick(this, [...propertiesThatCanBeModified, this.specificModifiableProps] as (keyof this)[]) }
    }
}