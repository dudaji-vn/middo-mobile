import { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaLayout = forwardRef<View, ViewProps>((props, ref) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      {...props}
      ref={ref}
      className="flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    />
  );
});
SafeAreaLayout.displayName = 'SafeAreaLayout';
