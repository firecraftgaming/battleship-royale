import React, { useState } from "react";
import { useConn } from "../../hooks/useConn";
import { randomize } from "../../lib/BoatFuntions";
import { BoatStoreType, useBoatStore } from "../../stores/useBoatStore";
import { useUserStore, UserStoreType } from "../../stores/useUserStore";
import { GameBoard } from "./GameBoard";

const shoot: ((x: number, y: number) => void) = (x, y) => null;

export const Game: React.FC = ({ }) => {
    const [id, name, setUser] = useUserStore((state: UserStoreType) => [state.id, state.username, state.setUser]);
    const [boats, setBoats] = useBoatStore((state: BoatStoreType) => [state.boats, state.setBoats])

    const conn = useConn();
    const ready = !!id;

    const [shotsReceived, setShotsReceived] = useState([]);
    const [shotsSent, setShotsSent] = useState([]);

    const login = async () => {
        const data = await conn.sendCall('player:join', {name, boats})
        console.log(data);
        const {username, id} = data as {username: string, id: string};
        setUser(username, id);
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center w-full h-6 text-primary-100 font-bold text-3xl">
                <div className="flex w-600 pl-4 justify-start items-center h-full m-5 mb-0">
                    You
                </div>
                <div className="flex w-600 pl-4 justify-start items-center h-full m-5 mb-0">
                    {'Test'}
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <GameBoard own={true} shots={shotsReceived} ready={ready} />
                {
                    ready 
                    ? <GameBoard own={false} ready={true} shots={shotsSent} onShot={(x, y) => shoot(x, y)} />
                    : <div className="flex justify-center items-center w-600 h-600 bg-primary-700 m-5">
                        <button 
                            className="flex w-15 h-15 justify-center items-center p-2 bg-accent rounded-8"
                            onClick={() => login()}
                        >
                            <div className="text-primary-100 font-bold text-3xl leading-6">Ready!</div>
                        </button>
                    </div>
                }
            </div>
            <div className="flex justify-center items-center w-full h-6 text-primary-100 font-bold text-3xl">
                <div className="flex w-600 justify-start items-center h-full m-5 mt-0">
                    {!ready &&
                    <button 
                        className="flex flex-nowrap justify-center items-center p-1 bg-accent rounded-8"
                        onClick={() => setBoats(randomize())}
                    >
                        <div className="text-primary-100 font-bold text-3xl pr-2 leading-6">Randomize</div>
                        <svg viewBox='0 0 512 512' width="32" height="32">
                            <path d='M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92' fill="none" stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32'/>
                            <path d='M32 256l44-44 46 44M480 256l-44 44-46-44' fill="none" stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32'/>
                        </svg>
                    </button>
                    }
                </div>
                <div className="flex w-600 h-full m-5 mt-0">
                    
                </div>
            </div>
        </div>
    )
};