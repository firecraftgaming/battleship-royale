import React from "react";
import { getBoat, Mover } from "../../lib/BoatFuntions";
import { Boat, Shot } from "../../lib/BoatModels";
import { GameColumn } from "./GameColumn";

interface GameBoardProps {
    own: boolean;
    shots: Shot[];
    ready: boolean;
    boats: Boat[];
    active: boolean;
    onShot?: (x: number, y: number) => unknown;
}

export const GameBoard: React.FC<GameBoardProps> = ({ own, shots, onShot, ready, boats, active }) => {
    const cols = [];

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            cols.push({x, y});
        }
    }

    const c = []
    if (!own) {
        if (!active) {
            c.push('cursor-pointer');
        } else {
            c.push('cursor-default');
            c.push('hover:bg-primary-800');
        }
    }

    return (
        <div className="grid grid-cols-10 game-board bg-primary-700 m-5" style={{
            opacity: active ? 1 : 0.4
        }}>
            {cols.map(({x, y}, i) => {
                const boat = getBoat(boats, x, y);
                const shot = shots.find(v => v.x == x && v.y == y);

                const classes = [...c]
                if (own) {
                    if (boat && !ready) classes.push('cursor-move'); else classes.push('cursor-default');
                    if (boat) classes.push('bg-accent');
                }

                const className = classes.join(' ');

                let innerClasses = '';
                if (shot && shot.hit) innerClasses = 'bg-secondary';
                if (shot && !shot.hit) innerClasses = 'bg-primary-100';

                return (
                    <GameColumn
                        key={i}
                        own={own}

                        ready={ready}
                        boat={boat}

                        x={x}
                        y={y}

                        className={className}
                        innerClassname={innerClasses}

                        onShot={(x, y) => {
                            onShot?.(x, y);
                        }}
                    />
                )
            })}
        </div>
    )
};