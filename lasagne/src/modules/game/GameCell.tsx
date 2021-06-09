import React from "react";
import { Dimensions, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Colors, Font, Rounded, Spacing } from "../../lib/Design";

interface GameCellProps {
    top: React.ReactNode;
    center: React.ReactNode;
    bottom: React.ReactNode
}

export const GameCell: React.FC<GameCellProps> = ({ top, center, bottom }) => {
        return (
        <View>
            <View style={style.container}>
                {top}
            </View>
            {center}
            <View style={style.container}>
                {bottom}
            </View>
        </View>
    )
};

const vw = Dimensions.get('window').width / 100;

const style = {
    container: {
        display: 'flex',
        
        justifyContent: 'center',
        alignItems: 'center',

        width: 35 * vw,
        height: Spacing[6],
    } as StyleProp<ViewStyle> as object,
};