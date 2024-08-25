import {useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'lucide-react-native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/colors';
import {globalStyles, TEXT} from '../styles';
import Button from './Button';
import {SIZES} from '../constants/sizes';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({title}) => {
  const navigation = useNavigation();

  return (
    <View style={[headerStyles.container, globalStyles.mainContainer]}>
      <Button
        icon={<ArrowLeft />}
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
      <Text style={TEXT.h4}>{title}</Text>
      <View style={headerStyles.blank} />
    </View>
  );
};

export const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  blank: {
    width: SIZES.lIcon,
    padding: SIZES.s,
  },
});

export default Header;
