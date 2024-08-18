import {CustomCircle, CustomRect} from '@/components/canvas/Shapes';
import {
    Canvas,
    CanvasOptions,
    CircleProps,
    FabricObject,
    Group,
    Point,
    RectProps,
    TMat2D,
    TPointerEventInfo,
    util
} from 'fabric';
import {log} from '@/components/firebase/logger';

export class CustomCanvas extends Canvas {
    _objectsById: Record<string, FabricObject>
    _backgroundObjects: Group

    constructor(element: HTMLCanvasElement, options?: Partial<CanvasOptions>) {
        super(element, options);
        const scaleW = 1000 / this.width;
        const scaleH = 1000 / this.height;

        const scale = Math.min(scaleW, scaleH);
        this._backgroundObjects = new Group([], {selectable: false, interactive: false, hoverCursor: "auto"});
        this._objectsById = {};

        this.set('enableRetinaScaling', true);

        this.setViewportTransform([scale, 0, 0, scale, 0, 0])
        this.setupEvents();
        this.add(this._backgroundObjects);
    }

    addOrUpdateFromDb(obj: Record<string, unknown>) {
        if (!obj) {
            return;
        }
        for (const id in obj) {
            const {type, ...representation} = obj[id] as Partial<CircleProps | RectProps> & { type: string };
            const liveVersion = this._objectsById[id];
            if (type === "Circle") {
                if (liveVersion) {
                    liveVersion.set(representation as {});
                } else {
                    const newShape = new CustomCircle({...(representation) as Partial<CircleProps>, id, loaded: true})
                    this.add(
                        newShape
                    );
                }
            } else if (type === "Rect") {
                if (liveVersion) {
                    liveVersion.set({...representation, id} as {});
                } else {
                    const newShape = new CustomRect({...(representation) as Partial<RectProps>, id, loaded: true})
                    this.add(
                        newShape
                    );
                }
            }
        }
        this.requestRenderAll();
    }

    add(...objects: (FabricObject)[]) {
        for (const obj of objects) {
            if (obj.get('id') && !(obj instanceof Group)) {
                this._objectsById[obj.get('id')] = obj;
                log(`${obj.type.toLowerCase()}_added` as 'circle_added')
            }
        }

        return super.add(...objects);
    }

    remove(...objects: (FabricObject)[]) {
        for (const obj of objects) {
            log(`${obj.type.toLowerCase()}_removed` as 'circle_removed')
        }
        return super.remove(...objects);
    }

    setupEvents() {
        this.on('mouse:wheel', this.onZoom.bind(this));
        this.on('mouse:down', this.startDrag.bind(this));
    }

    getRandomColor() {
        const colours = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown", "black", "white"];
        return colours[Math.floor(Math.random() * colours.length)];
    }

    getRandomBounds() {
        const {tl, br} = this.calcViewportBoundaries();
        const size = (10 + Math.random() * 20) / this.getZoom();
        const left = tl.x + (Math.random() * (br.x - tl.x)) - size / 2
        const top = tl.y + (Math.random() * (br.y - tl.y)) - size / 2
        return {
            size,
            left,
            top,
        }
    }

    setupKeyboardEvents(key: string) {
        if (key === "c") {
            this.addCircle({});
        } else if (key === "s") {
            this.addRect({})
        }
        if (key === "Backspace") {
            this.onDelete();
        }
    }

    addCircle(options: Partial<CircleProps>) {
        const {size, ...bounds} = this.getRandomBounds();
        const finalOptions = Object.assign({
            radius: 20,
            scaleX: size / 20,
            scaleY: size / 20,
            fill: this.getRandomColor(), ...bounds
        }, options)
        return this.add(new CustomCircle(finalOptions));
    }

    addRect(options: Partial<RectProps>) {
        const {size, ...bounds} = this.getRandomBounds();
        const finalOptions = Object.assign({
            width: 20, height: 20, scaleX: size / 20, scaleY: size / 20, fill: this.getRandomColor(), ...bounds
        }, options)
        return this.add(new CustomRect(finalOptions));
    }

    /**
     * Fabric js will render objects much more efficiently in groups.
     *
     * We move objects into a group once it is too small to be seen, this should reduce
     * the number of drawImage() calls that fabric js has to make when the screen moves.
     */
    shuffleObjects = () => {
        console.log('shuffle')
        const {x: gx, y: gy} = this._backgroundObjects.getTotalObjectScaling();
        this._backgroundObjects.forEachObject(obj => {
            const {x, y} = obj.getTotalObjectScaling()
            if (obj.isOnScreen() && x * gx * obj.width > 20 || y * gy * obj.height > 20) {
                this._backgroundObjects.remove(obj)
                this.add(obj);
                console.log('foreground', obj)
            }
        })
        this.forEachObject(obj => {
            if (obj === this._backgroundObjects || !obj.isOnScreen()) {
                return
            }
            const {x, y} = obj.getTotalObjectScaling()
            if (x * obj.width <= 10 || y * obj.height <= 10) {
                this._backgroundObjects.add(obj);
                obj.set('final', false)
                this.remove(obj)
                console.log('background', obj)

            }
        })

    }

    setViewportTransform(vpt: TMat2D) {
        super.setViewportTransform(vpt);
        this.shuffleObjects();
    }

    onZoom(opt: TPointerEventInfo<WheelEvent>) {
        let {deltaX, deltaY} = opt.e;

        if (opt.e.ctrlKey) {
            const [zoomX] = this.viewportTransform;


            let targetZoom = zoomX * Math.pow(.97, deltaY);
            if (targetZoom < 0.01) targetZoom = .01;
            if (targetZoom > 10) targetZoom = 10;


            const point = new Point(opt.e.offsetX, opt.e.offsetY);
            const before = point,
                vpt: TMat2D = [...this.viewportTransform];
            const newPoint = point.transform(util.invertTransform(vpt));
            vpt[0] = targetZoom;
            vpt[3] = targetZoom;
            const after = newPoint.transform(vpt);
            vpt[4] += before.x - after.x;
            vpt[5] += before.y - after.y;
            this.setViewportTransform(vpt);
            log('zoom')
        } else {
            const movement = new Point(deltaX, deltaY);
            const movementAdjustForZoom = movement.multiply({x: 1 / (this.getZoom() / 2), y: 1 / (this.getZoom() / 2)});
            this.setViewportTransform(
                util.multiplyTransformMatrices(this.viewportTransform, util.createTranslateMatrix(-movementAdjustForZoom.x, -movementAdjustForZoom.y))
            )
        }
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    startDrag(opt: TPointerEventInfo<MouseEvent>) {
        if ((opt.e.button === 0 || opt.e.type === "touchstart") && !this.findTarget(opt.e)) {
            this.selection = false;
            const handler = this.handleDrag(this.viewportTransform, this.getPointFromEvent(opt.e));
            log('pan')
            this.on('mouse:move', handler);
            this.once('mouse:up', () => {
                this.off('mouse:move', handler)
            });
        }
    }

    handleDrag = (initialVp: TMat2D, pos: Point) => (opt: TPointerEventInfo<MouseEvent>) => {

        const newPoint = this.getPointFromEvent(opt.e);
        const diff = newPoint.subtract(pos).multiply({x: 1 / this.getZoom(), y: 1 / this.getZoom()});
        this.setViewportTransform(
            util.multiplyTransformMatrices(initialVp, util.createTranslateMatrix(diff.x, diff.y))
        )
    }


    getPointFromEvent(e: MouseEvent | TouchEvent) {
        if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
            return new Point(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
        return new Point((e as MouseEvent).clientX, (e as MouseEvent).clientY)
    }

    onDelete() {
        const activeObject = this.getActiveObject();
        if (activeObject) {
            this.remove(activeObject);
            if (activeObject instanceof Group) {
                activeObject.getObjects().forEach(obj => this.remove(obj));
            }
            this.discardActiveObject();
        }
    }

    getCountOnScreen() {
        return Object.values(this._objectsById).length
    }
}