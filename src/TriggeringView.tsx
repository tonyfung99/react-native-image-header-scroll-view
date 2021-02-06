import React, {
  FunctionComponent,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, Animated, ViewProps } from 'react-native';
import { ImageHeaderScrollViewContext } from './ImageHeaderScrollViewContext';

interface Props extends ViewProps {
  onBeginHidden?: () => void;
  onHide?: () => void;
  onBeginDisplayed?: () => void;
  onDisplay?: () => void;
  onTouchTop?: (enter: boolean) => void;
  onTouchBottom?: (enter: boolean) => void;
  bottomOffset?: number;
  topOffset?: number;
}

export const TriggeringView: FunctionComponent<Props> = ({
  topOffset = 0,
  bottomOffset = 0,
  onDisplay,
  onBeginDisplayed,
  onHide,
  onBeginHidden,
  onTouchBottom,
  onTouchTop,
  onLayout,
  children,
  ...viewProps
}) => {
  const [initialPageY, setInitialPageY] = useState(() => 0);
  const ref = useRef<View>();
  const touched = useRef(false);
  const hidden = useRef(false);
  const context = useContext(ImageHeaderScrollViewContext);

  const [height, setHeight] = useState(0);
  useEffect(() => {
    console.log(context.scrollY);
    if (!context.scrollY) {
      return;
    }
    const listenerId = context.scrollY.addListener(onScroll);

    return () => {
      context.scrollY.removeListener(listenerId);
    };
  }, []);

  const handleOnLayout = (e: any) => {
    if (onLayout) {
      onLayout(e);
    }
    if (!ref) {
      return;
    }
    const layout = e.nativeEvent.layout;
    setHeight(layout.height);

    ref.current?.measure((_x, _y, _width, _height, _ageX, pageY) => {
      setInitialPageY(pageY);
    });
  };

  const onScroll = (event: any) => {
    if (!context.scrollPageY) {
      return;
    }
    const pageY = initialPageY - event.value;
    triggerEvents(context.scrollPageY, pageY, pageY + height);
  };

  const triggerEvents = (value: number, top: number, bottom: number) => {
    if (!touched.current && value >= top + topOffset) {
      touched.current = true;

      onBeginHidden?.();
      onTouchTop?.(true);
    } else if (touched && value < top + topOffset) {
      touched.current = false;

      onDisplay?.();
      onTouchTop?.(false);
    }

    if (!hidden.current && value >= bottom + bottomOffset) {
      hidden.current = true;
      onHide?.();
      onTouchBottom?.(true);
    } else if (hidden.current && value < bottom + bottomOffset) {
      hidden.current = false;
      onBeginDisplayed?.();
      onTouchBottom?.(false);
    }
  };

  return (
    <View
      ref={(instance) => {
        if (instance !== null) {
          ref.current = instance;
        }
      }}
      collapsable={false}
      {...viewProps}
      onLayout={handleOnLayout}
    >
      {children}
    </View>
  );
};
