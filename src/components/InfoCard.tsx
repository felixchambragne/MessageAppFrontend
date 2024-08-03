import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TEXT} from '../styles';
import {SIZES} from '../constants/sizes';
import { COLORS } from '../constants/colors';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({title, description, icon}) => {
  return (
    <View style={styles.container}>
      {icon}
      <View style={styles.textContainer}>
        <Text style={[TEXT.h3, styles.title]}>{title}</Text>
        <Text style={[TEXT.p, styles.description]}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: SIZES.l,
    padding: SIZES.l,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  description: {
    textAlign: 'center',
    color: COLORS.mutedForeground,
  },
  title: {
    textAlign: 'center',
  },
});

export default InfoCard;
