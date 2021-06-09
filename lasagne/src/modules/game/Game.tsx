import React, { useEffect, useState } from "react";
import { Text, TextStyle, StyleProp, ViewStyle, View, Dimensions, ScrollView } from "react-native";
import { useMediaQuery } from "react-responsive";
import { useConn } from "../../hooks/useConn";
import { Mover, randomize } from "../../lib/BoatFuntions";
import { Boat, Shot, Target } from "../../lib/BoatModels";
import { Colors, Font, Rounded, Spacing } from "../../lib/Design";
import { useUserStore, UserStoreType } from "../../stores/useUserStore";
import { RandomizeButton } from "../../ui/RandomizeButton";
import { ReadyBox } from "../../ui/ReadyBox";
import { GameBoard } from "./GameBoard";
import { GameCell } from "./GameCell";
import { GameHeader } from "./GameHeader";

interface Self {
    boats: Boat[];
    shots: Shot[];
}

export const Game: React.FC = ({ }) => {
    const [id, name, setUser] = useUserStore((state: any) => [state.id, state.username, state.setUser]);

    
    const [target, setTarget] = useState<Target | null>(null);
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
        <ScrollView style={style.container} onTouchEnd={() => Mover.onUp()} contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'center'
        }}>
            <GameHeader left={name} right={started ? players.toString() : ''} />
            <View style={style.cells}>
                <GameCell 
                    top={(
                        <Text style={style.cell_top_name}>You</Text>
                    )}
                    center={(
                        <GameBoard active={true} own={true} shots={self.shots} boats={self.boats} ready={ready} />
                    )}
                    bottom={!ready && <RandomizeButton onRandomize={boats => setSelf({
                        boats: boats,
                        shots: self.shots
                    })} />}
                />
                <GameCell 
                    top={(
                        <Text style={style.cell_top_name}>{started && target && target.username}</Text>
                    )}
                    center={(
                        started && target
                        ? <GameBoard active={turn} own={false} ready={true} shots={target.shots} boats={target.boats} onShot={(x, y) => shoot(x, y)} />
                        : <ReadyBox ready={ready} onStart={start} onReady={login} />
                    )}
                    bottom={null}
                />
            </View>
        </ScrollView>
    )
};

const vw = Dimensions.get('window').width / 100;

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',

        width: Spacing.full,
        minHeight: Spacing.full,
    } as StyleProp<ViewStyle> as object,
    cells: {
        width: Spacing.full,
        height: Spacing.full,

        display: 'flex',
        flexDirection: 'column',
        
        justifyContent: 'flex-start',
        alignItems: 'center',

    } as StyleProp<ViewStyle> as object,
    cell_top_name: {
        display: 'flex',
        paddingLeft: Spacing[4],
        
        justifyContent: 'flex-start',
        alignItems: 'center',

        h: Spacing.full,
        width: 35 * vw,
        
        margin: Spacing[5],
        marginBottom: Spacing[0],

        color: Colors.white,
        fontSize: Font.size["3xl"],
        fontWeight: Font.weight.BOLD,

        fontFamily: Font.family,
    } as StyleProp<TextStyle> as object,
};