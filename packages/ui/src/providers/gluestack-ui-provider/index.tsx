
import React from 'react';
import { config } from './config';
import type { ViewProps } from 'react-native';
import {  View} from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';


export function GluestackUIProvider({
  ...props
}: {
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const {colorScheme} = useColorScheme();

  return (
    <View
      style={[
        config[colorScheme],
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}

