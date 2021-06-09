import React from "react";
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { Colors, Font, Rounded, Spacing } from "../lib/Design";
import { randomize } from "../lib/BoatFuntions";
import { Boat } from "../lib/BoatModels";
import { RandomizeLogo } from "./RandomizeLogo";

interface RandomizeButtonProps {
    onRandomize: (data: Boat[]) => unknown;
}

export const RandomizeButton: React.FC<RandomizeButtonProps> = ({ onRandomize }) => {
    return (
        <TouchableOpacity
            style={style.container}
            onPress={() => onRandomize?.(randomize())}
        >
            <Text style={style.text}>Randomize</Text>
            <RandomizeLogo />
        </TouchableOpacity>
    )
};

const style = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        
        justifyContent: 'center',
        alignItems: 'center',

        padding: Spacing[1],
        backgroundColor: Colors.accent,
        borderRadius: Rounded.M
    } as StyleProp<ViewStyle> as object,
    text: {
        color: Colors.white,
        fontWeight: Font.weight.BOLD,
        fontSize: Font.size["3xl"],
        lineHeight: Spacing[6],
        paddingRight: Spacing[2],

        fontFamily: Font.family
    } as StyleProp<TextStyle> as object,
};