import React from 'react';
import { Animated } from 'react-native';

export interface ImageHeaderScrollViewState {
  scrollY: Animated.Value;
  scrollPageY: number;
}

export const ImageHeaderScrollViewContext = React.createContext<ImageHeaderScrollViewState>({
  scrollY: new Animated.Value(0),
  scrollPageY: 0,
});
