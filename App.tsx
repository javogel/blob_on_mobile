import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';

import Blob from './Components/Blob';
import Svg from 'react-native-svg';

const ANIMATED_PRIMITIVES = [
  new Animated.Value(0),
  new Animated.Value(1),
  new Animated.Value(2),
  new Animated.Value(3),
  new Animated.Value(4),
  new Animated.Value(5),
  new Animated.Value(6),
  new Animated.Value(7)
]

const MAX_RADIUS=30;
const MIN_RADIUS=10;

// const MAX_RADIUS=180;
// const MIN_RADIUS=35;

export default function App() {
  const animation = useRef<Animated.CompositeAnimation | undefined>(undefined)
  const [blobState, setBlobState] = useState("inhale")


  const animatedRadius = useRef(new Animated.Value(0)).current





  useEffect(() => {
    if (animation.current !== undefined) {
      (animation.current).stop()
    }
    if (blobState === "inhale") {
      animation.current = Animated.timing(
        animatedRadius,
        {
          toValue: MAX_RADIUS,

          duration: 2500,
          // useNativeDriver: true
        }
      )
    } else if ((blobState === "exhale")) {
      animation.current = Animated.timing(
        animatedRadius,
        {
          toValue: MIN_RADIUS,

          duration: 2500,
          // useNativeDriver: true
        }
      )
    }
    (animation.current as any).start()

  }, [blobState])


  animatedRadius.addListener(({ value }) => {

    if (value === MIN_RADIUS) {
      setBlobState("inhale")
    } else if (value == MAX_RADIUS) {
      setBlobState("exhale")
    }
  })

  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height

  const BLOB_COUNT = 4



  return (
    <View style={styles.container}>
      <Svg width={width} height={height}  >
        {new Array(BLOB_COUNT).fill(undefined).map((_, i)=>{
            const blobIndex = i + 1;
           return (<Blob key={blobIndex} radius={Animated.multiply(animatedRadius, ANIMATED_PRIMITIVES[blobIndex])} finalRadius={blobIndex*MAX_RADIUS} width={width} height={height} />)
        })}
   
      </Svg >
      {/* <Text>Open up App.tsx to start working on your app!</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});






