import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors, Font, Rounded, Spacing } from "../../lib/Design";

interface GameHeaderProps {
    left: string;
    right: string
}

export const GameHeader: React.FC<GameHeaderProps> = ({ left, right }) => {
    return (
        <View style={style.container}>
            <Text style={style.text}>{left}</Text>
            <Text style={style.text}>{right}</Text>
        </View>
    )
};

const style = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        
        justifyContent: 'space-between',
        alignItems: 'center',

        width: Spacing.full,
        height: Spacing[8],

        padding: Spacing[6],

        backgroundColor: Colors.transparent,
    } as StyleProp<ViewStyle> as object,
    text: {
        color: Colors.white,
        fontWeight: Font.weight.BOLD,
        fontSize: Font.size["3xl"],

        fontFamily: Font.family,
    } as StyleProp<TextStyle> as object,
};

const sm_style = {};