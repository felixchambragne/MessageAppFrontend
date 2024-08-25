import React, {cloneElement} from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import {TEXT} from '../styles';

interface ButtonProps extends PressableProps {
  text?: string;
  icon?: React.ReactElement;
  iconLeft?: React.ReactElement;
  iconRight?: React.ReactElement;
  iconSize?: number;
  variant?: 'primary' | 'secondary' | 'destructive';
}

const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  iconLeft,
  iconRight,
  iconSize = SIZES.sIcon,
  variant = 'primary',
  style,
  ...props
}) => {
  const themes = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.primaryForeground,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      color: COLORS.mutedForeground,
    },
    destructive: {
      backgroundColor: COLORS.destructive,
      color: COLORS.destructiveForeground,
    },
  };
  const theme = themes[variant] || {};

  const iconLeftElement = iconLeft
    ? cloneElement(iconLeft || icon, {
        color: theme.color,
        size: iconSize,
      })
    : null;

  const iconRightElement = iconRight
    ? cloneElement(iconRight, {
        color: theme.color,
        size: iconSize,
      })
    : null;

  const iconElement = icon
    ? cloneElement(icon, {
        color: theme.color,
        size: iconSize,
      })
    : null;

  return (
    <Pressable
      style={({pressed}: PressableStateCallbackType) => [
        style as StyleProp<ViewStyle>,
        styles.button,
        !!icon && styles.iconButton,
        {backgroundColor: theme.backgroundColor},
        {opacity: pressed ? 0.9 : 1},
      ]}
      {...props}>
      {iconLeftElement || iconElement}
      {text && <Text style={[TEXT.pMedium, {color: theme.color}]}>{text}</Text>}
      {iconRightElement}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.s,
  },
  iconButton: {
    paddingHorizontal: SIZES.s,
    paddingVertical: SIZES.s,
    aspectRatio: 1,
    alignSelf: 'center',
  },
});

export default Button;
