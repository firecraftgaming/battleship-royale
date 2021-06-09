import React, { useEffect } from "react";
import { Dimensions, PanResponder, StyleProp, View, ViewStyle } from "react-native";
import { useMediaQuery } from "react-responsive";
import { getBoat, Mover } from "../../lib/BoatFuntions";
import { Boat, Shot } from "../../lib/BoatModels";
import { Spacing, Rounded, Colors } from "../../lib/Design";
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
    let board: View | null = null;

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            cols.push({x, y});
        }
    }

    useEffect(() => {
        if (!own) return;
        board?.measure((_x, _y, width, height, pageX, pageY) => {
            Mover.client = {
                x: pageX,
                y: pageY,

                w: width,
                h: height
            };
        });
    });

    const styles = [style.container, !active ? {opacity: 0.4} : {}];

    return (
        <View style={styles} ref={ref => board = ref} >
            {cols.map(({x, y}, i) => {
                const boat = getBoat(boats, x, y);
                const shot = shots.find(v => v.x == x && v.y == y);

                let col_style = {} as StyleProp<ViewStyle>;
                let hit_style = {} as StyleProp<ViewStyle>;
                
                if (own && boat) col_style = {backgroundColor: Colors.accent};   
                if (shot && shot.hit) hit_style = {backgroundColor: Colors.secondary};
                if (shot && !shot.hit) hit_style = {backgroundColor: Colors.primary[100]};

                return (
                    <GameColumn
                        key={i}
                        own={own}

                        ready={ready}
                        boat={boat}

                        x={x}
                        y={y}

                        style={col_style}
                        innerStyle={hit_style}

                        onShot={(x, y) => {
                            onShot?.(x, y);
                        }}
                    />
                )
            })}
        </View>
    )
};

const vw = Dimensions.get('window').width / 100;

const style = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: Colors.primary[700],
        margin: Spacing[5],
        
        width: 70 * vw,
        height: 70 * vw,
        
    } as StyleProp<ViewStyle> as object,
};