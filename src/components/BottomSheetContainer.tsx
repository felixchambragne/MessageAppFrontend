import React, {forwardRef, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../constants/colors';
import {SIZES} from '../constants/sizes';
import {globalStyles} from '../styles';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

interface BottomSheetProps {
  children: React.ReactNode;
}

const BottomSheetContainer = forwardRef<BottomSheet, BottomSheetProps>(
  ({children}, ref) => {
    const renderBackdrop = useCallback(
      (_props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {..._props}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        keyboardBlurBehavior="restore"
        backdropComponent={renderBackdrop}
        index={-1}
        backgroundStyle={{backgroundColor: COLORS.background}}
        handleIndicatorStyle={{backgroundColor: COLORS.mutedForeground}}>
        <BottomSheetView style={globalStyles.mainContainer}>
          {children}
          <View style={styles.footer} />
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  footer: {
    height: SIZES.l,
  },
});

export default BottomSheetContainer;
