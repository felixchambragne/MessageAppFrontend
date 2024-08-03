import React from 'react';
import {FlexAlignType, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import {TEXT} from '../styles';
import {Message as MessageType} from '../types/types';

export interface MessageProps {
  message: MessageType;
  variant?: 'primary' | 'secondary';
}

const Message: React.FC<MessageProps> = ({message, variant = 'primary'}) => {
  const themes = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.primaryForeground,
      alignSelf: 'flex-end' as FlexAlignType,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      color: COLORS.secondaryForeground,
      alignSelf: 'flex-start' as FlexAlignType,
    },
  };
  const theme = themes[variant] || {};

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.backgroundColor, alignSelf: theme.alignSelf},
      ]}>
      <Text style={(TEXT.p, {color: theme.color})}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.s,
    borderRadius: SIZES.radius,
    maxWidth: '80%',
  },
});

export default Message;
