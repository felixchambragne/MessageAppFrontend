import {FontVariant, StyleSheet} from 'react-native';
import {COLORS} from './constants/colors';
import {SIZES} from './constants/sizes';

export const globalStyles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
  },
});

export const TEXT = StyleSheet.create({
  h1: {
    fontSize: 36,
    fontFamily: 'Inter-ExtraBold',
    color: COLORS.foreground,
    fontVariant: ['tabular-nums'] as FontVariant[],
  },
  h2: {
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    color: COLORS.foreground,
    lineHeight: 33,
  },
  h3: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.foreground,
  },
  h4: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.foreground,
  },
  p: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.foreground,
    lineHeight: 15.3,
  },
  pMedium: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.foreground,
  },
  small: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.foreground,
  },
});
