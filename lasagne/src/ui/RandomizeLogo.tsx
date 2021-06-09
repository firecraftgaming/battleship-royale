import React from "react";
import { Path, Svg } from "react-native-svg";
export const RandomizeLogo: React.FC = () => {
    return (
        <Svg viewBox='0 0 512 512' width="32" height="32">
            <Path d='M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92' fill="none" stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32'/>
            <Path d='M32 256l44-44 46 44M480 256l-44 44-46-44' fill="none" stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='32'/>
        </Svg>
    )
};