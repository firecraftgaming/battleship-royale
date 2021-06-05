import React, { useState } from "react";
import { getBoat, Mover, overlap } from "../../lib/BoatFuntions";
import { Boat, Border, Shot } from "../../lib/BoatModels";
import { BoatStoreType, useBoatStore } from "../../stores/useBoatStore";
import { GameColumn } from "./GameColumn";

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

interface GameBoardProps {
    own: boolean;
    shots: Shot[];
    ready: boolean;
    onShot?: (x: number, y: number) => unknown;
}

export const GameBoard: React.FC<GameBoardProps> = ({ own, shots, onShot, ready }) => {
    const [boats, setBoats] = useBoatStore((state: BoatStoreType) => [state.boats, state.setBoats]);
    const borders = getBorders(boats);

    return (
        <div className="grid grid-cols-10 w-600 h-600 bg-primary-700 m-5">
            {new Array(100).fill(null).map((_, i) => {
                const x = i % 10;
                const y = Math.floor(i / 10);

                const boat = getBoat(boats, x, y);
                const shot = shots.find(v => v.x == x && v.y == y);

                return (
                    <GameColumn
                        key={i}
                        own={own}
                        ready={ready}
                        shot={shot}
                        boat={boat !== null}
                        border={borders.find(v => v.x == x && v.y == y)?.info ?? {}}
                        onClick={() => {
                            if (own) {
                                if (ready) return;

                                const boat = getBoat(boats, x, y);
                                if (!boat) return;

                                let valid = true;
                                
                                const opposite = {
                                    x: 'y' as 'x' | 'y',
                                    y: 'x' as 'x' | 'y'
                                }

                                const fake = {...boat, rot: opposite[boat.rot] ?? boat.rot}


                                const xl = fake.rot == 'x' ? x + fake.length : x;
                                const yl = fake.rot == 'y' ? y + fake.length : y;

                                if (xl > 10 || yl > 10) valid = false

                                for (let b of boats) {
                                    if (b.x == fake.x && b.y == fake.y) continue;
                                    if (overlap(fake, b)) valid = false;
                                }

                                if (valid) boat.rot = fake.rot;
                                return setBoats([...boats]);
                            }
                            if (shots.find(v => v.x == x && v.y == y)) return;
                            onShot?.(x, y);
                        }}

                        onDown={() => {
                            if (!own || ready) return;
                            Mover.onDown(boats, x, y)
                        }}
                        onUp={() => {
                            if (!own || ready) return;
                            Mover.onUp(x, y)
                        }}
                        onEnter={() => {
                            if (!own || ready) return;
                            Mover.onEnter(boats, x, y, () => setBoats([...boats]))
                        }}
                    />
                )
            })}
        </div>
    )
};