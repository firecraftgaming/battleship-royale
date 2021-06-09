import React, { useState } from "react";
import { StyleProp, ViewStyle, StyleSheet, View, TextStyle, Text, TextInput, TouchableOpacity } from "react-native";
import { Border, Colors, Font, Rounded, Spacing } from "../lib/Design";
import { useUserStore } from "../stores/useUserStore";
import { useMediaQuery } from "react-responsive";

export const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);

    const setUser = useUserStore((state: any) => state.setUser);

    const onChange = (text: string) => {
        setError(false);
        setName(text);
    }

    const onDone = async () => {
        if (!name) return setError(true);
        setUser(name, '');
    };

    return (
        <View style={style.container}>
            <Text style={style.welcome}>Welcome!</Text>
            <Text style={style.welcome_text}>Fill your name in the box below to begin battleship royale</Text>
            <TextInput
                style={{...style.name, ...(error ? style.name_error : {})}}
                value={name}
                onChange={e => onChange(e.nativeEvent.text)}
                onKeyPress={e => e.nativeEvent.key == 'Enter' && onDone()}
                placeholder="Name"
                placeholderTextColor={Colors.primary[300]}
            />
            <TouchableOpacity
                style={style.done}
                onPress={_ => onDone()}
            >
                <Text style={style.done_text}>Done</Text>
            </TouchableOpacity>
        </View>
    );
};

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: Spacing[6],
        
        justifyContent: 'center',
        alignItems: 'center',
    } as StyleProp<ViewStyle> as object,
    welcome: {
        color: Colors.white,
        fontWeight: Font.weight.BOLD,
        fontSize: Font.size["3xl"],
        width: Spacing.full,

        lineHeight: Font.size["3xl"] * 1.5,
        fontFamily: Font.family,
    } as StyleProp<TextStyle> as object,
    welcome_text: {
        color: Colors.white,
        fontWeight: Font.weight.NORMAL,
        fontSize: Font.size["2xl"],
        width: Spacing.full,
        
        lineHeight: Font.size["2xl"] * 1.5,
        fontFamily: Font.family,
    } as StyleProp<TextStyle> as object,
    name: {
        width: Spacing.full,
        fontSize: Font.size["2xl"],
        marginTop: Spacing[6],
        paddingVertical: Spacing[2],
        paddingHorizontal: Spacing[4],
        borderRadius: Rounded.M,
        color: Colors.white,
        backgroundColor: Colors.primary[700],

        fontFamily: Font.family,
    } as StyleProp<TextStyle> as object,
    name_error: {
        borderWidth: Border.S,
        borderColor: Colors.secondary
    } as StyleProp<TextStyle> as object,
    done: {
        width: Spacing.full,
        marginTop: Spacing[2],
        paddingVertical: Spacing[2],
        paddingHorizontal: Spacing[4],
        borderRadius: Rounded.M,
        backgroundColor: Colors.accent,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as StyleProp<ViewStyle> as object,
    done_text: {
        fontSize: Font.size["2xl"],
        fontWeight: Font.weight.BOLD,
        color: Colors.white,

        fontFamily: Font.family,
    } as StyleProp<TextStyle> as object,
};