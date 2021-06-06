import React, { useEffect, useState } from "react";
import { useConn } from "../../hooks/useConn";
import { Mover, randomize } from "../../lib/BoatFuntions";
import { Boat, Shot, Target } from "../../lib/BoatModels";
import { BoatStoreType, useBoatStore } from "../../stores/useBoatStore";
import { useUserStore, UserStoreType } from "../../stores/useUserStore";
import { GameBoard } from "./GameBoard";

interface Self {
    boats: Boat[];
    shots: Shot[];
}

export const Game: React.FC = ({ }) => {
    const [id, name, setUser] = useUserStore((state: UserStoreType) => [state.id, state.username, state.setUser]);
    const [target, setTarget] = useState<Target>(null);
    const [self, setSelf] = useState<Self>({
        boats: randomize(),
        shots: []
    });
    const [turn, setTurn] = useState(false);
    const [started, setStarted] = useState(false);

    const [players, setPlayers] = useState(0);

    Mover.boats = self.boats;
    Mover.onMove = () => setSelf({
        boats: self.boats,
        shots: self.shots
    });

    const conn = useConn();
    const ready = !!id;

    const login = async () => {
        const data = await conn.sendCall('player:join', {name, boats: self.boats})
        console.log(data);
        const {username, id} = data as {username: string, id: string};
        setUser(username, id);
    }

    const shoot: ((x: number, y: number) => void) = (x, y) => {
        conn.sendCast('game:shoot', {x, y})
    };

    const start: (() => void) = () => {
        conn.sendCast('game:start', {})
    };

    useEffect(() => {
        if (!conn) return;
        conn.addListener('game:update', (data) => {
            const payload = data.data as {target: Target, started: boolean, turn: boolean, shots: Shot[], boats: Boat[], players: number};

            setTarget(payload.target);
            setStarted(payload.started);
            setTurn(payload.turn);
            setPlayers(payload.players)
            setSelf({
                boats: payload.boats,
                shots: payload.shots
            });
        });
        conn.addListener('game:kick', (data) => {
            const payload = data.data as {reason: string};

            alert(payload.reason);

            setStarted(false);
            setTarget(null);
            setTurn(false);
            setPlayers(0)
            setUser(name, '');
            setSelf({
                boats: self.boats,
                shots: []
            });
        });
    }, [conn]);

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            <div className="flex flex-row justify-between items-center w-full h-8 p-6 bg-transparent text-primary-100 font-bold text-3xl">
                <div>{name}</div>
                <div>{started && players}</div>
            </div>
            <div className="w-full h-full flex flex-col sm:flex-row justify-start sm:justify-center items-center">
                <div>
                    <div className="flex justify-center items-center game-board-width h-6 text-primary-100 font-bold text-3xl">
                        <div className="flex pl-4 justify-start items-center h-full m-5 mb-0 game-board-width">
                            You
                        </div>    
                    </div>
                    <GameBoard active={true} own={true} shots={self.shots} boats={self.boats} ready={ready} />
                    <div className="flex justify-center items-center game-board-width h-6 text-primary-100 font-bold text-3xl">
                        <div className="flex justify-start items-center h-full m-5 mt-0 game-board-width">
                            {!ready &&
                            <button 
                                className="flex flex-nowrap justify-center items-center p-1 bg-accent rounded-8"
                                onClick={() => setSelf({
                                    boats: randomize(),
                                    shots: self.shots
                                })}
                            >
                                <div className="text-primary-100 font-bold text-3xl pr-2 leading-6">Randomize</div>
                                <svg viewBox='0 0 512 512' width="32" height="32">
                                    <path d='M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92' fill="none" stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32'/>
                                    <path d='M32 256l44-44 46 44M480 256l-44 44-46-44' fill="none" stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32'/>
                                </svg>
                            </button>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-center items-center game-board-width h-6 text-primary-100 font-bold text-3xl">
                        <div className="flex pl-4 justify-start items-center h-full m-5 mb-0 game-board-width">
                            {started && target.username}
                        </div>  
                    </div>
                    {
                        started &&
                        <GameBoard active={turn} own={false} ready={true} shots={target.shots} boats={target.boats} onShot={(x, y) => shoot(x, y)} />
                    }
                    {
                        !started &&
                        <div className="flex justify-center items-center game-board bg-primary-700 m-5">
                            {
                                ready ?
                                <button 
                                    className="flex w-15 h-15 justify-center items-center p-2 bg-accent rounded-8"
                                    onClick={() => start()}
                                >
                                        <div className="text-primary-100 font-bold text-3xl leading-6">Start!</div>
                                </button>
                                : 
                                <button 
                                    className="flex w-15 h-15 justify-center items-center p-2 bg-accent rounded-8"
                                    onClick={() => login()}
                                >
                                    <div className="text-primary-100 font-bold text-3xl leading-6">Ready!</div>
                                </button>
                            }
                        </div>
                    }
                    <div className="flex justify-center items-center game-board-width h-6 text-primary-100 font-bold text-3xl">
                        <div className="flex h-full m-5 mt-0 game-board-width">
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};