import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

interface LoadableViewProps extends ViewProps {
  loading: boolean;
}

const LoadableView: React.FC<LoadableViewProps> = ({loading, ...props}) => {
  return (
    <>
      <View {...props}>{props.children}</View>
    </>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    flex: 1,
  },
});

export default LoadableView;
