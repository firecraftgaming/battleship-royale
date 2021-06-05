import React from "react";
import { BorderInfo, Shot } from "../../lib/BoatModels";

interface GameColumnProps {
    border?: BorderInfo;
    shot: Shot;
    own: boolean;
    boat: boolean;
    ready: boolean;
    
    onClick: () => unknown;

    onUp?: () => unknown;
    onEnter?: () => unknown;
    onDown?: () => unknown;
}

const getBorders = ( border: BorderInfo ) => Object.keys(border).map(v => `border-${v}-4 border-${v}-hit`).join(' ');

export const GameColumn: React.FC<GameColumnProps> = ({ border, shot, own, boat, ready, onClick, onUp, onEnter, onDown }) => {
    return (
        <button 
            className={`
                flex box-border border border-primary-100 justify-center items-center
                ${getBorders(border)} ${!own ? 'cursor-pointer' : !ready && boat ? 'cursor-move' : 'cursor-default'}
                ${own && boat ? ' bg-accent' : ''}
            `}
            onClick={_ => onClick()}

            onMouseUp={_ => onUp?.()}
            onMouseEnter={_ => onEnter?.()}
            onMouseDown={_ => onDown?.()}
        >
            <div className={`w-4 h-4 rounded-lg bg-${shot && shot.hit ? 'secondary' : shot && !shot.hit ? 'primary-100' : ''}`}></div>
        </button>
    )
};