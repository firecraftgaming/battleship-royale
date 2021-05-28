import React from "react";
import { BorderInfo, Shot } from "../../../lib/BoatModels";

interface GameColumnProps {
    border?: BorderInfo;
    shot: Shot;
    own: boolean;
    boat: boolean;
    onClick: () => unknown;
}

const getBorders = ( border: BorderInfo ) => Object.keys(border).map(v => `border-${v}-4 border-${v}-hit`).join(' ');

export const GameColumn: React.FC<GameColumnProps> = ({ border, shot, own, boat, onClick }) => {
    return (
        <button 
            className={`
                flex box-border border border-primary-100 justify-center items-center
                ${getBorders(border)} ${!own ? 'cursor-pointer' : 'cursor-default'}
                ${own && boat ? ' bg-accent' : ''}
            `}
            onClick={e => onClick()}
            >
            <div className={`w-4 h-4 rounded-lg bg-${shot && shot.hit ? 'secondary' : shot && !shot.hit ? 'primary-100' : ''}`}></div>
        </button>
    )
};