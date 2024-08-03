import React from 'react';
import {Pressable, PressableProps, StyleSheet, Text} from 'react-native';
import {TEXT} from '../styles';
import {SIZES} from '../constants/sizes';
import {COLORS} from '../constants/colors';

interface ButtonProps extends PressableProps {
  text?: string;
  icon?: (color: string, size: number) => React.ReactNode;
  iconLeft?: (color: string, size: number) => React.ReactNode;
  iconRight?: (color: string, size: number) => React.ReactNode;
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

  return (
    <Pressable
      style={[
        styles.button,
        icon && styles.iconButton,
        {backgroundColor: theme.backgroundColor},
      ]}
      {...props}>
      {(iconLeft && iconLeft(theme.color, iconSize)) ||
        (icon && icon(theme.color, iconSize))}
      {text && <Text style={[TEXT.button, {color: theme.color}]}>{text}</Text>}
      {iconRight && iconRight(theme.color, iconSize)}
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
    paddingHorizontal: SIZES.xs,
    paddingVertical: SIZES.xs,
    aspectRatio: 1,
  },
});

export default Button;
