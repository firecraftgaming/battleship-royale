import React from "react";
import { Mover } from "../../lib/BoatFuntions";
import { Boat, BorderInfo } from "../../lib/BoatModels";

const getBorder: ((boat: Boat, x: number, y: number) => string) = (boat, x, y) => {
    if (!boat) return '';
    if (!boat.sunk) return '';

    const border: BorderInfo = {};

    if (boat.rot == 'x') {
        border.t = true;
        border.b = true;
    }
    if (boat.rot == 'y') {
        border.l = true;
        border.r = true;
    }

    if (boat.rot == 'x') {
        const first = x == boat.x && y == boat.y;
        const last = x == boat.x + boat.length - 1 && y == boat.y;

        if (first) border.l = true;
        if (last) border.r = true;
    }
    if (boat.rot == 'y') {
        const first = x == boat.x && y == boat.y;
        const last = x == boat.x && y == boat.y + boat.length - 1;

        if (first) border.t = true;
        if (last) border.b = true;
    }

    return Object.keys(border).map(v => `border-${v}-2 sm:border-${v}-4 border-${v}-hit`).join(' ')
}

interface GameColumnProps {
    own: boolean;
    
    boat: Boat;
    ready: boolean;

    x: number;
    y: number;

    className: string;
    innerClassname: string;
    
    onShot: (x: number, y: number) => unknown;
}

export const GameColumn: React.FC<GameColumnProps> = ({ own, boat, x, y, ready, onShot, className, innerClassname }) => {
    return (
        <button
            className={`
                flex game-column box-border border border-primary-100 justify-center items-center ${getBorder(boat, x, y)} ${className}
            `}

            onClick={() => {
                if (!own) return onShot?.(x, y);
                if (!ready) Mover.rotate(x, y); 
            }}

            onPointerDown={() => {
                console.log('pointer down', x, y);
                if (own && !ready) Mover.onDown(x, y)
            }}
            onPointerUp={() => {
                console.log('pointer up', x, y);
                if (own && !ready) Mover.onUp(x, y)
            }}

            onMouseEnter={() => {
                console.log('mouse move', x, y);
                if (own && !ready) Mover.onEnter(x, y)
            }}

            onTouchMove={event => {
                const node = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);

                if (!node.classList.contains('game-column')) return;

                let child = node as ChildNode;
                let i = 0;
                while((child = child.previousSibling) != null) i++;

                const x = i % 10;
                const y = Math.floor(i / 10);

                if (own && !ready) Mover.onEnter(x, y)
            }}
        >
            <div className={`rounded-lg game-column-hit ${innerClassname}`}></div>
        </button>
    )
};