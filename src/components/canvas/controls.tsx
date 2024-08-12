import { Control, util } from 'fabric';


export class DeleteControl extends Control {
    constructor(onDelete: () => void) {
        super({
            x: .5,
            y: -1,
            offsetY: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: onDelete,
            render: (ctx, left, top, _, fabricObject) => {
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(util.degreesToRadians(fabricObject.angle));
                ctx.fillStyle = 'black';
                ctx.font = '22px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('x', 0, 0);
                ctx.fillStyle = 'red';
                ctx.font = '20px sans-serif';
                ctx.fillText('x', 0, 0);
                ctx.restore();
            },
        });
    }
}

