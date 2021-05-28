import React, { useState } from "react";
import { GameBoard } from "./GameBoard";

export const Game: React.FC = ({ }) => {
    const [shotsReceived, setShotsReceived] = useState([]);
    const [shotsSent, setShotsSent] = useState([]);

    return (
        <div className="flex flex-row justify-center items-center">
            <GameBoard own={true} shots={shotsReceived} />
            <GameBoard own={false} shots={shotsSent} onShot={(x, y) => {
                setShotsSent([...shotsSent, {
                    x,
                    y,
                    hit: false,
                }]);
                setShotsReceived([...shotsReceived, {
                    x,
                    y,
                    hit: true,
                }]);
            }} />
        </div>
    )
};