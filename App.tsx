import React, { useState } from 'react';
import {
  View,
  Image,
  Button,
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { RNCamera } from 'react-native-camera'


const SERVER_URL = 'https://75fb-77-204-105-195.ngrok.io';

const App = () => {
  const [photo, setPhoto] = React.useState(null);
  const [isProcessed, setIsProcessed] = React.useState(true);
  const [matrix, setMatrix] = React.useState(null);
  let camera: RNCamera;
  
  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response && response.assets?.length) {
        setPhoto(response.assets[0]);
      } else {
        console.log('error', response);
      }
    });
  };

  const handleUploadPhoto = async () => {
    const photoBuffer = await RNFetchBlob.fs.readFile(photo.uri, 'base64');
    const response = await fetch(`${SERVER_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: photoBuffer,
        type: photo.uri.split('.').pop(),
        config: {
          resize: {
            width: 28,
            height: 28,
          },
          contrast: 0.8,
          brightness: 0.5,
          grayscale: true,
          toMatrix: true,
        }
      }),
    });
    const data = await response.json();
    setIsProcessed(true);
    setTimeout(() => {
      setIsProcessed(false);
    }, 3000);

    setMatrix(data.payload);
  }

  const takePicture = async (camera) => {
    const options = { base64: true };
    const data = await camera.takePictureAsync(options);
    setPhoto(data);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.saveArea}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitleText}>Polytech Persistance</Text>
        </View>
      </SafeAreaView>

      <View style={styles.caption}>
        <Text style={styles.captionTitleText}>
          {photo ? 'Photo' : 'Camera'}
        </Text>
      </View>

      {
        (!(photo || isProcessed)) && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <RNCamera
              style={
                  {
                    width: '75%',
                    height: '75%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    borderWidth: 25,
                    borderColor: 'black',
                    position: 'absolute',
                    top: 0,
                  }
                }
                ref={ref => {
                  camera = ref;
                }}
            />
            <View style={{
              margin: 50,
              borderRadius: 10,
              padding: 10,
              backgroundColor: 'white',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}>
              <TouchableOpacity onPress={() => takePicture(camera)} style={[styles.btn, { width: 120 }]}>
                <Text style={styles.btnText}>Capture</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => takePicture(camera)} style={[styles.btn, { width: 120 }]}>
                <Text style={styles.btnText}>Draw</Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={handleChoosePhoto} style={[styles.btn, { width: 120 }]}>
                <Text style={styles.btnText}>Pick</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
      
      { (photo && !isProcessed) && (
        <View style={
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }>
          <Image
            source={{ uri: photo.uri }}
            style={
              {
                width: '75%',
                height: '75%',
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 25,
                borderColor: 'black',
                position: 'absolute',
                top: 0,
              }
            }
          />

          <View style={{
              margin: 50,
              borderRadius: 10,
              padding: 10,
              backgroundColor: 'white',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
          }}>
            <TouchableOpacity onPress={handleUploadPhoto} style={styles.btn}>
              <Text style={styles.btnText}>Process</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPhoto(null); }} style={[styles.btn,
              {
                backgroundColor: '#d16262'
              }]}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {(isProcessed) && (
        //  Text who say that the photo is processed
        <View style={
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Processing...</Text>

          <View style={{

            margin: 50,
            borderRadius: 10,
            padding: 10,
            backgroundColor: 'white',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
            {/* Send to a selected bluetooth device button */}
            <TouchableOpacity onPress={() => { }} style={styles.btn}>
              <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>
            {/* Cancel the process button */}
            <TouchableOpacity onPress={() => { setIsProcessed(false); }} style={[styles.btn,
              {
                backgroundColor: '#d16262'
              }]}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2FC',
  },
  saveArea: {
    backgroundColor: '#62d1bc',
  },
  topBar: {
    height: 50,
    backgroundColor: '#62d1bc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleText: {
    color: '#ffffff',
    fontSize: 20,
  },
  caption: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionTitleText: {
    color: '#121B0D',
    fontSize: 16,
    fontWeight: '600'
  },
  btn: {
    width: 240,
    borderRadius: 8,
    backgroundColor: '#62d1bc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginVertical: 8,
  },
  btnText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  cameraControl: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default App;