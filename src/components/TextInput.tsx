import React from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import {TEXT} from '../styles';

const TextInput: React.FC<TextInputProps> = props => {
  return (
    <RNTextInput
      style={[styles.input, TEXT.p]}
      placeholderTextColor={COLORS.mutedForeground}
      cursorColor={COLORS.mutedForeground}
      underlineColorAndroid={COLORS.transparent}
      selectionColor={COLORS.highlight}
      selectionHandleColor={COLORS.primary}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: COLORS.input,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    color: COLORS.foreground,
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.xs,
    flex: 1,
  },
});

export default TextInput;
