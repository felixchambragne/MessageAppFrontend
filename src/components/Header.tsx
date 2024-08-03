import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {globalStyles, TEXT} from '../styles';
import {COLORS} from '../constants/colors';

const Header = () => {
  return (
    <View style={[styles.container, globalStyles.mainContainer]}>
      <Text style={[TEXT.h1]}>13:45:12</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
});

export default Header;
