import React, { useState } from "react";
import { Boat, Border, Shot } from "../../../lib/BoatModels";
import { GameColumn } from "./GameColumn";

const XY2I: ((x: number, y: number) => number) = (x, y) => 10 * y + x
const I2XY: ((i: number) => [number, number]) = i => [i % 10, Math.floor(i / 10)];

const getBorders: ((boats: Boat[]) => Border[]) = boats => {
    return boats.filter(v => v.sunk).map(v => {
        const borders = new Array(v.length).fill(null).map((_, i) => {
            const border: Border = {
                x: v.x,
                y: v.y,

                info: {},
            };

            if (v.rot == 'x') {
                border.info.t = true;
                border.info.b = true;

                border.x += i;
            }
            if (v.rot == 'y') {
                border.info.l = true;
                border.info.r = true;

                border.y += i;
            }

            return border;
        });

        const first = borders[0];
        const last = borders[v.length - 1];

        if (v.rot == 'x') {
            first.info.l = true;
            last.info.r = true;
        }
        if (v.rot == 'y') {
            first.info.t = true;
            last.info.b = true;
        }

        return borders;
    }).reduce((acc, val) => [...acc, ...val], []);
}

const getBoat: ((boats: Boat[], x: number, y: number) => Boat | null) = (boats, x, y) => boats.filter(v => {
    if (v.rot == 'x') {
        if (v.y != y) return false;
        if (v.x > x) return false;
        if (v.x + v.length <= x) return false;
    }
    if (v.rot == 'y') {
        if (v.x != x) return false;
        if (v.y > y) return false;
        if (v.y + v.length <= y) return false;
    }
    return true;
})[0] ?? null;

const boats: Boat[] = [
    {
        x: 1,
        y: 1,

        length: 4,
        rot: 'y',

        sunk: true
    },
    {
        x: 2,
        y: 7,

        length: 5,
        rot: 'x',

        sunk: false
    }
];

const s: Shot[] = [
    {
        x: 1,
        y: 1,
        hit: true,
    },
    {
        x: 1,
        y: 2,
        hit: true,
    },
    {
        x: 1,
        y: 3,
        hit: true,
    },
    {
        x: 1,
        y: 4,
        hit: true,
    },
    {
        x: 5,
        y: 5,
        hit: false,
    },
    {
        x: 6,
        y: 4,
        hit: false,
    },
    {
        x: 5,
        y: 7,
        hit: true,
    }
];

interface GameBoardProps {
    own: boolean;
    shots: Shot[];
    onShot?: (x: number, y: number) => unknown;
}

export const GameBoard: React.FC<GameBoardProps> = ({ own, shots, onShot }) => {
    const borders = getBorders(boats);

    return (
        <div className="grid grid-cols-10 w-600 h-600 bg-primary-700 m-5">
            {new Array(100).fill(null).map((v, i) => {
                const x = i % 10;
                const y = Math.floor(i / 10);

                return (
                    <GameColumn
                        key={i}
                        own={own}
                        shot={shots.find(v => v.x == x && v.y == y)}
                        boat={getBoat(boats, ...I2XY(i)) !== null}
                        border={borders.find(v => v.x == x && v.y == y)?.info ?? {}}
                        onClick={() => {
                            if (own) return;
                            if (shots.find(v => v.x == x && v.y == y)) return;
                            onShot?.(x, y);
                        }}
                    />
                )
            })}
        </div>
    )
};