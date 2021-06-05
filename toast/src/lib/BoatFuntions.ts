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
    public boat: Boat;
    public offset: number;

    public static active: Mover = null;

    public constructor(boats, x, y) {
        const boat = getBoat(boats, x, y);
        const xOffset = x - boat.x;
        const yOffset = y - boat.y;

        this.boat = boat;
        this.offset = Math.max(xOffset, yOffset);
    }

    public static onDown(boats, x, y) {
        if (!getBoat(boats, x, y)) return;
        this.active = new Mover(boats, x, y);
    }

    public static onEnter(boats, x, y, done?) {
        if (!this.active) return;

        const boat = this.active.boat;
        const offset = this.active.offset;

        x = boat.rot == 'x' ? x - offset : x;
        y = boat.rot == 'y' ? y - offset : y;

        let valid = true;

        const xl = boat.rot == 'x' ? x + boat.length : x;
        const yl = boat.rot == 'y' ? y + boat.length : y;

        if (xl > 10 || yl > 10) valid = false;
        if (x < 0 || x < 0) valid = false;

        for (let b of boats) {
            if (b.x == boat.x && b.y == boat.y) continue;
            if (overlap({...boat, x, y}, b)) valid = false;
        }

        if (valid) [boat.x, boat.y] = [x, y];
        done?.()
    }

    public static onUp(x, y) {
        this.active = null;
    }
}