import React, { useState } from 'react';
import {
  View,
  Image,

  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { RNCamera } from 'react-native-camera'
import BluetoothClassic from 'react-native-bluetooth-classic';

const SERVER_URL = 'https://4050-2a01-cb00-f9c-6800-f66d-bc6e-bacf-4bfb.eu.ngrok.io';

// (async () => {
//   try {

//     const macAddress = '68:27:19:F8:98:57';
//     const device = await BluetoothClassic.connectToDevice(macAddress);
//     console.log('device', device);

//     while (true) {
//       const data = await device.write('Hello World');
//       console.log('data', data);
//     }

//   } catch (error) {
//     console.error(error);
//   }
  
// })();


const sendToBluetooth = async (matrix) => {
  console.log('matrix', matrix);
  const macAddress = '68:27:19:F8:98:57';
  const device = await BluetoothClassic.connectToDevice(macAddress);
  console.log('device', device);
  while (true) {
    const data = await device.write(matrix);
    console.log('data', data);
    setTimeout(() => {
      console.log('timeout');
      return;
    }, 5000);
  }
}



const App = () => {
  const [photo, setPhoto] = React.useState(null);
  const [processedPhoto, setProcessedPhoto] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [matrix, setMatrix] = React.useState(null);
  const [bluetoothDevice, setBluetoothDevice] = React.useState(null);
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

  const handlePhotoProcessing = async () => {
    setIsProcessing(true);
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
    setIsProcessing(false);
    setMatrix(data.payload);
    setProcessedPhoto(data.payload);
  };


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

      {
        (!(photo || isProcessing)) && (
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
                    top: 50,
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
              <TouchableOpacity onPress={handleChoosePhoto} style={[styles.btn, { width: 120 }]}>
                <Text style={styles.btnText}>Pick</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }

      {(isProcessing) && (
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
            <TouchableOpacity onPress={() => { }} style={styles.btn}>
              <Text style={styles.btnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIsProcessing(false); }} style={[styles.btn,
              {
                backgroundColor: '#d16262'
              }]}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      { (photo && !isProcessing && !processedPhoto) && ( // Captured image before processing
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
                top: 50
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
            <TouchableOpacity onPress={handlePhotoProcessing} style={styles.btn}>
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

      {(photo && !isProcessing && processedPhoto) && ( // Captured image after processing display just processed image text
        <View style={
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Processed</Text>
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
            {/* call send to bluetooth */}
            <TouchableOpacity onPress={() => {
              sendToBluetooth(matrix);
            }} style={styles.btn}>
              <Text style={styles.btnText}>Send to BLE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setPhoto(null);
              setProcessedPhoto(null);
              setMatrix(null);
              setIsProcessing(false);
            }} style={[styles.btn,
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