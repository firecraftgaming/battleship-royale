export interface Boat {
    x: number;
    y: number;

    length: number;
    rot: 'x' | 'y';

    sunk: boolean;
}
export interface Shot {
    x: number;
    y: number;

    hit: boolean;
}
export interface Border {
    x: number;
    y: number;

    info: BorderInfo
}
export interface BorderInfo {
    l?: boolean;
    r?: boolean;
    t?: boolean;
    b?: boolean;
}
export interface Target {
    id: string;
    username: string;

    shots: Shot[];
    boats: Boat[];
}