import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Header from '../components/Header';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import {globalStyles, TEXT} from '../styles';
import {useTranslation} from 'react-i18next';

interface Item {
  title: string;
  description: string;
}

export default function AboutScreen() {
  const {t} = useTranslation();
  const appVersion = DeviceInfo.getVersion();

  const renderSteps = (items: Array<Item> = []) => {
    return items.map((step: Item, index: number) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={TEXT.pMedium}>{index + 1}.</Text>
        <View style={styles.itemTextContainer}>
          <Text style={TEXT.pMedium}>{step.title}</Text>
          <Text style={[TEXT.p, {color: COLORS.mutedForeground}]}>
            {step.description}
          </Text>
        </View>
      </View>
    ));
  };

  const renderFeatures = (items: Array<Item> = []) => {
    return items.map((item: Item, index: number) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={TEXT.pMedium}>•</Text>
        <View style={styles.itemTextContainer}>
          <Text style={TEXT.pMedium}>{item.title}</Text>
          <Text style={[TEXT.p, {color: COLORS.mutedForeground}]}>
            {item.description}
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={[styles.container]}>
      <Header title={t('about_title')} />
      <ScrollView
        contentContainerStyle={[
          globalStyles.mainContainer,
          styles.contentContainer,
        ]}>
        <View style={styles.sectionContainer}>
          <Text style={TEXT.h2}>
            {t('welcome_text', {app_name: t('app_name')})}
          </Text>
          <Text style={TEXT.p}>
            {t('description', {app_name: t('app_name')})}
          </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={TEXT.h3}>{t('how_it_works.title')}</Text>
          <View style={styles.sectionItemContainer}>
            {renderSteps(
              t('how_it_works.items', {returnObjects: true}) as Array<Item>,
            )}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={TEXT.h3}>{t('features.title')}</Text>
          <View style={styles.sectionItemContainer}>
            {renderFeatures(
              t('features.items', {returnObjects: true}) as Array<Item>,
            )}
          </View>
        </View>
        <Text style={TEXT.p}>{t('coming_soon')}</Text>
        <Text style={[TEXT.p, styles.versionText]}>
          {t('version_text', {version: appVersion, app_name: t('app_name')})}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    gap: SIZES.xl,
    paddingVertical: SIZES.xl,
  },
  sectionContainer: {
    flexDirection: 'column',
    gap: SIZES.m,
  },
  sectionItemContainer: {
    flexDirection: 'column',
    gap: SIZES.s,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  itemTextContainer: {
    flexDirection: 'column',
    gap: SIZES.xs,
    flex: 1,
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.mutedForeground,
  },
});
