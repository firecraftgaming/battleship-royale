import React from "react";
import { Text, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, Dimensions } from "react-native";
import { Spacing, Rounded, Colors, Font } from "../lib/Design";

interface ReadyButtonProps {
    onClick: () => void;
    title: string;
}

interface ReadyBoxProps {
    ready: boolean;
    onStart: () => unknown;
    onReady: () => unknown;
}

export const ReadyButton: React.FC<ReadyButtonProps> = ({ onClick, title }) => {
    return (
        <TouchableOpacity 
            style={style.button}
            onPress={onClick}
        >
            <Text style={style.text}>{title}</Text>
        </TouchableOpacity>
    )
};

export const ReadyBox: React.FC<ReadyBoxProps> = ({ ready, onStart, onReady }) => {
    return (
        <View style={style.container}>
            {
                ready ? <ReadyButton onClick={() => onStart?.()} title="Start!" /> : <ReadyButton onClick={() => onReady?.()} title="Ready!" />
            }
        </View>
    )
};

const vw = Dimensions.get('window').width / 100;

const style = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
        width: 70 * vw,
        height: 70 * vw,

        backgroundColor: Colors.primary[700],
        margin: Spacing[5],
    } as StyleProp<ViewStyle> as object,
    button: {
        display: 'flex',

        width: Spacing[15],
        height: Spacing[15],

        justifyContent: 'center',
        alignItems: 'center',

        padding: Spacing[2],      
        backgroundColor: Colors.accent,
        borderRadius: Rounded.M
    } as StyleProp<ViewStyle> as object,
    text: {
        color: Colors.white,
        fontWeight: Font.weight.BOLD,
        fontSize: Font.size["3xl"],
        lineHeight: Spacing[6],

        fontFamily: Font.family
    } as StyleProp<TextStyle> as object,
};