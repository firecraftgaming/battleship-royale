import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Colors, Spacing } from "../lib/Design";

export const MainLayout: React.FC = ({ children }) => {
  return (
    <View style={style}>
      {children}
    </View>
  );
};

const style = {
  flex: 1,
  backgroundColor: Colors.primary[900],
  height: Spacing.full,
  width: Spacing.full,

  padding: Spacing[0],
  margin: Spacing[0],

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
} as StyleProp<ViewStyle>;