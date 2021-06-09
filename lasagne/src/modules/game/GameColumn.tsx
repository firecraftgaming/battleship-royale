import React from "react";
import { Dimensions, StyleProp, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Mover } from "../../lib/BoatFuntions";
import { Boat, BorderInfo } from "../../lib/BoatModels";
import { Colors, Rounded } from "../../lib/Design";

const getBorder: ((boat: Boat | null, x: number, y: number) => StyleProp<ViewStyle>[]) = (boat, x, y) => {
    if (!boat) return [];
    if (!boat.sunk) return [];

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

    const translation = new Map<string, string>();
    translation.set('t', 'Top');
    translation.set('b', 'Bottom');
    translation.set('r', 'Right');
    translation.set('l', 'Left');

    return Object.keys(border).map(v => ({
        ['border' + (translation.get(v) ?? '') + 'Width']: 2,
        ['border' + (translation.get(v) ?? '') + 'Color']: Colors.secondary,
    }) as StyleProp<ViewStyle>);
}

interface GameColumnProps {
    own: boolean;
    
    boat: Boat | null;
    ready: boolean;

    x: number;
    y: number;

    style: StyleProp<ViewStyle>;
    innerStyle: StyleProp<ViewStyle>;
    
    onShot: (x: number, y: number) => unknown;
}

export const GameColumn: React.FC<GameColumnProps> = ({ own, boat, x, y, ready, onShot, style, innerStyle }) => {
    /*
        ={() => {
                if (!own) return onShot?.(x, y);
                if (!ready) Mover.rotate(x, y); 
            }}
    */
    return (
        <View 
            style={[styles.container, style, ...getBorder(boat, x, y)]}

            

            onTouchStart={e => {
                const client = Mover?.client ?? {x: 0, y: 0, w: 1, h: 1};

                const pageX = e.nativeEvent.touches[0].pageX;
                const pageY = e.nativeEvent.touches[0].pageY;
                
                const relX = pageX - client.x;
                const relY = pageY - client.y;

                const x = Math.floor(relX * 10 / client.w);
                const y = Math.floor(relY * 10 / client.h);
                
                if (own && !ready) Mover.onDown(x, y)
            }}

            onTouchMove={e => {
                if (!own || ready) return;
                const client = Mover?.client ?? {x: 0, y: 0, w: 1, h: 1};

                const pageX = e.nativeEvent.touches[0].pageX;
                const pageY = e.nativeEvent.touches[0].pageY;
                
                const relX = pageX - client.x;
                const relY = pageY - client.y;

                const x = Math.floor(relX * 10 / client.w);
                const y = Math.floor(relY * 10 / client.h);

                console.log(x, y, pageX, pageY, Mover.client);
                Mover.onEnter(x, y)
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    if (!own) return onShot?.(x, y);
                    if (!ready) Mover.rotate(x, y); 
                }}
                style={[styles.container, style]}
            >
                <View style={[styles.hit, innerStyle]} pointerEvents={'none'}/>
            </TouchableWithoutFeedback>
        </View >
    )
};

const vw = Dimensions.get('window').width / 100;

const styles = {
    container: {
        display: 'flex',
        width: 7 * vw,
        height: 7 * vw,
        borderWidth: 1,
        borderColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    } as StyleProp<ViewStyle> as object,
    hit: {
        borderRadius: Rounded.M,
        width: 2 * vw,
        height: 2 * vw,
    } as StyleProp<ViewStyle> as object,
};