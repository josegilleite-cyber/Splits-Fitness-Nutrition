import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function withSafeArea(Component) {
  return function SafeAreaWrapper(props) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom", "left", "right"]}>
        <Component {...props} />
      </SafeAreaView>
    );
  };
}
