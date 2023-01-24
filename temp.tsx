/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {  Platform, Image, View, Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

//  import Canvas from canvas API

import Canvas from 'react-native-canvas';


function HomeScreen(): JSX.Element {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}

/////////////////////////////// Import Image Screen ///////////////////////////////

function ImportImageScreen(): JSX.Element {
  const [photo, setPhoto] = React.useState(null);

  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      console.log("response", response);
      if (response) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const HandlePhotoSend = () => {
    // copy the image to assets folder
    const source = { uri: photo.uri };
  
  };

  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {photo && (
        <>
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 300, height: 300 }}
            onLoad={HandlePhotoSend}
          />
          <Button title="Upload Photo" onPress={HandlePhotoSend} />
        </>
      )}
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
    </View>
  );
}

/////////////////////////////// App ///////////////////////////////
function App(): JSX.Element {
  return (
    <ImportImageScreen />
  );
}

const styles = StyleSheet.create({

});

export default App;
