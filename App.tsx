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
import BleManager from 'react-native-ble-manager';
import RNFS from 'react-native-fs';

import { NativeEventEmitter, NativeModules } from 'react-native';


const SERVER_URL = 'https//1c5f-46-193-64-142.eu.ngrok.io';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// Request bluetooth authorization
BleManager.start({
  showAlert: false,
})
  .then(() => {
    console.log('BLE authorization granted');
  })
  .catch((error) => {
    console.log('BLE authorization denied', error);
  });

BleManager.scan([], 30, true, {
  rssiThreshold: -100,
  rssi: -100,
});

// refactor above code to a promise
const discoverPeripheral = new Promise((resolve, reject) => {
  const argsArray = [];
  bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", (args) => {
    if (!argsArray.some((arg) => arg.id === args.id)) {
      argsArray.push(args);
      console.log(args.id)
    }
  });

  // setTimeout(() => {
  //   resolve(argsArray);
  // }, 10000);
});

(async () => {
  // const peripherals = await discoverPeripheral;
  // const connectablePeripherals = peripherals.filter((peripheral) => peripheral.advertising.isConnectable);
  // console.log("#peripherals", peripherals.length);
  // // print only the IDs
  // peripherals.forEach((peripheral) => {
  //   console.log("peripheralID", peripheral.id + "\n");
  // });

  // try {
  //   await BleManager.connect(peripheral.id);
  //   const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
  //   console.log("peripheralInfo", JSON.stringify(peripheralInfo));
  // } catch (error) {
  //   console.log("connection error", error);
  // }

  // let macAddress = "68:27:19:F8:98:57";
  // const connectablePeripherals = peripherals.filter((peripheral) => peripheral.advertising.isConnectable);
  // peripherals.forEach((peripheral) => {
  //   console.log("peripheralID", JSON.stringify(peripheral) + "\n");
  //   if (peripheral.id == macAddress) {
  //     console.log("Found peripheral with mac address");
  //   }
  // });

  // console.log("\n\n\nperipherals length", peripherals.length);



})();







 
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

      {/* {
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
      )} */}

      <View style={
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Please select a device</Text>
          <TouchableOpacity onPress={() => {
           
          
           }} style={styles.btn}>
            <Text style={styles.btnText}>Start Scanning</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setPhoto(null);
            setProcessedPhoto(null);
            }} style={[styles.btn,
            {
              backgroundColor: '#d16262'
            }]}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      {/* {(photo && !isProcessing && processedPhoto) && ( // Captured image after processing

      )} */}
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