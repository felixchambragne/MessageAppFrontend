import {ArrowRight, Siren} from 'lucide-react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import Button from './Button';
import InfoCard from './InfoCard';
import {useBottomSheet} from '@gorhom/bottom-sheet';

const NewContactBottomSheet = () => {
  const {t} = useTranslation();
  const {close} = useBottomSheet();

  return (
    <View style={styles.container}>
      <InfoCard
        title={t('new_contact')}
        description={t('new_contact_description')}
        icon={<Siren size={SIZES.lIcon} color={COLORS.foreground} />}
      />
      <Button
        text={t('new_contact_button')}
        iconRight={<ArrowRight />}
        onPress={() => {
          close();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: SIZES.l,
  },
});

export default NewContactBottomSheet;
