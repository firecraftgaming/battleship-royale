import { Boat } from "./BoatModels";

export const getBoat: ((boats: Boat[], x: number, y: number) => Boat | null) = (boats, x, y) => boats.filter(v => insideClientRect(getClientRectBoat(v), x, y))[0] ?? null;

export interface ClientRect {
    x: number;
    y: number;

    w: number;
    h: number;
}

export const getClientRectBoat: ((boat: Boat) => ClientRect) = (boat) => {
    const client = {
        x: boat.x,
        y: boat.y,

        w: boat.rot == 'x' ? boat.length : 1,
        h: boat.rot == 'y' ? boat.length : 1
    }

    return client;
};

export const insideClientRect: ((client: ClientRect, x: number, y: number) => boolean) = (client, x, y) => {
    const wa = Math.abs(client.x + client.w / 2 - x - 1/2) * 2
    const ha = Math.abs(client.y + client.h / 2 - y - 1/2) * 2

    return wa < client.w && ha < client.h
};

export const overlap: ((aa: Boat, bb: Boat) => boolean) = (aa, bb) => {
    const a = getClientRectBoat(aa)
    const b = getClientRectBoat(bb)

    b.x -= 1;
    b.y -= 1;

    b.w += 2;
    b.h += 2;

    const ahw = a.x + a.w / 2
    const bhw = b.x + b.w / 2

    const ahh = a.y + a.h / 2
    const bhh = b.y + b.h / 2

    const w = a.w + b.w
    const h = a.h + b.h

    const wa = Math.abs(ahw - bhw) * 2
    const ha = Math.abs(ahh - bhh) * 2

    return wa < w && ha < h
};


export const randomize: (() => Boat[]) = () => {
    const lengths = [5, 4, 3, 3, 2];

    const boats: Boat[] = [];

    for (const length of lengths) {
        const rot = Math.random() > 0.5 ? 'x' : 'y';
        const locactions: ({x: number, y: number})[] = [];

        for (let x = 0; x < 11 - length; x++) {
            for (let y = 0; y < 11 - length; y++) {
                let valid = true;

                for (const boat of boats) {
                    if (overlap(boat, {x, y, length, rot, sunk: false})) valid = false;
                }

                if (valid) locactions.push({x, y});
            }
        }

        const index = Math.floor(Math.random() * locactions.length);
        if (index == locactions.length) break;

        boats.push({...locactions[index], length, rot, sunk: false});
    }

    if (boats.length < 5) return randomize();

    return boats;
};

export class Mover {
    public boat: Boat | null;
    public offset: number;

    private static active: Mover | null = null;
    public static boats: Boat[] = [];
    public static client: ClientRect | null = null;
    public static onMove: () => unknown;

    public constructor(boats: Boat[], x: number, y: number) {
        const boat = getBoat(boats, x, y);
        this.boat = boat;
        this.offset = 0;
        if (!boat) return;

        const xOffset = x - boat.x;
        const yOffset = y - boat.y;

        this.offset = Math.max(xOffset, yOffset);
    }

    public static onDown(x: number, y: number) {
        if (!getBoat(this.boats, x, y)) return;
        this.active = new Mover(this.boats, x, y);
    }

    public static onEnter(x: number, y: number) {
        if (!this.active) return;

        const boat = this.active.boat;
        const offset = this.active.offset;

        if (!boat) return;

        x = boat.rot == 'x' ? x - offset : x;
        y = boat.rot == 'y' ? y - offset : y;

        let valid = true;

        const xl = boat.rot == 'x' ? x + boat.length - 1 : x;
        const yl = boat.rot == 'y' ? y + boat.length - 1 : y;

        if (xl > 9 || yl > 9) valid = false;
        if (x < 0 || y < 0) valid = false;

        for (let b of this.boats) {
            if (b.x == boat.x && b.y == boat.y) continue;
            if (overlap({...boat, x, y}, b)) valid = false;
        }

        if (valid) [boat.x, boat.y] = [x, y];
        this.onMove?.();
    }

    public static onUp() {
        this.active = null;
    }

    public static rotate(x: number, y: number) {
        const boat = getBoat(this.boats, x, y);
        if (!boat) return;

        let valid = true;
        
        const opposite = {
            x: 'y' as 'x' | 'y',
            y: 'x' as 'x' | 'y'
        }

        const xl = boat.rot == 'y' ? boat.x + boat.length - 1 : boat.x;
        const yl = boat.rot == 'x' ? boat.y + boat.length - 1 : boat.y;

        if (xl > 9 || yl > 9) valid = false

        for (let b of this.boats) {
            if (b.x == boat.x && b.y == boat.y) continue;
            if (overlap({...boat, rot: opposite[boat.rot] ?? boat.rot}, b)) valid = false;
        }

        if (valid) boat.rot = opposite[boat.rot] ?? boat.rot;
        this.onMove?.();
    }
}