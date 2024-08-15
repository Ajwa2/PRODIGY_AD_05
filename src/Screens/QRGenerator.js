import { StyleSheet, Text, View,TextInput, TouchableOpacity, ScrollView,Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import QRCode from 'react-native-qrcode-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
// import { PERMISSIONS} from 'react-native-permissions';
import * as FileSystem from 'expo-file-system';
import { ReactMediaLibrary } from 'react-media-library';



const QRGenerator = () => {
    const navigation = useNavigation()
    const viewShotRef = useRef(null);
    const [qrValue, setQRValue] = useState({ name: '', phoneNumber: '', link:'' });
    const [isActive, setIsActive] = useState(false);

    const generateQRCode = () => {
        if (!qrValue.name || !qrValue.phoneNumber || !qrValue.link) return;
            setIsActive(true);
            setQRValue('')
    };

    // getPermissionAndroid = async () => {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       {
    //         title: 'Image Download Permission',
    //         message: 'Your permission is required to save images to your device',
    //         buttonNegative: 'Cancel',
    //         buttonPositive: 'OK',
    //       },
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       return true;
    //     }
    //     Alert.alert(
    //       'Save remote Image',
    //       'Grant Me Permission to save Image',
    //       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    //       {cancelable: false},
    //     );
    //   } catch (err) {
    //     Alert.alert(
    //       'Save remote Image',
    //       'Failed to save Image: ' + err.message,
    //       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    //       {cancelable: false},
    //     );
    //   }
    // };

    // saveQRCode = async () => {
    //   // if device is android you have to ensure you have permission
    //   if (Platform.OS === 'android') {
    //     const granted = await this.getPermissionAndroid();
    //     if (!granted) {
    //       return;
    //     }
    //   }
    //   this.setState({saving: true});
    //   RNFetchBlob.config({
    //     fileCache: true,
    //     appendExt: 'png',
    //   })
    //     .fetch('GET', this.state.url)
    //     .then(res => {
    //       CameraRoll.saveToCameraRoll(res.data, 'photo')
    //         .then(() => {
    //           Alert.alert(
    //             'Save remote Image',
    //             'Image Saved Successfully',
    //             [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    //             {cancelable: false},
    //           );
    //         })
    //         .catch(err => {
    //           Alert.alert(
    //             'Save remote Image',
    //             'Failed to save Image: ' + err.message,
    //             [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    //             {cancelable: false},
    //           );
    //         })
    //         .finally(() => this.setState({saving: false}));
    //     })
    //     .catch(error => {
    //       this.setState({saving: false});
    //       Alert.alert(
    //         'Save remote Image',
    //         'Failed to save Image: ' + error.message,
    //         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    //         {cancelable: false},
    //       );
    //     });
    // };
    const saveQRCode = async () => {
      try {
          // Request storage permission (iOS and Android)
          const { status } = await ReactMediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
              Alert.alert('Permission required', 'Storage permission is required to save QR codes.');
              return;
          }
  
          const uri = await viewShotRef.current.capture(); // Capture the QR code view
          if (!uri) {
              Alert.alert('Capture failed', 'Failed to capture QR code image.');
              return;
          }
  
          // Move the captured image to the media library (Gallery)
          const asset = await ReactMediaLibrary.createAssetAsync(uri);
          await ReactMediaLibrary.createAlbumAsync('QR Codes', asset, false); // Optionally, create a new album
  
          Alert.alert('Success', 'QR code saved successfully!');
      } catch (error) {
          console.error('Error saving QR code:', error);
          Alert.alert('Error', 'An error occurred while saving the QR code.');
      }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={()=>navigation.navigate('Home')}/>
        <Text style={styles.title}>QR Code Generator</Text>
       { !isActive && <View>
          <Text style={styles.description}>Enter the required to create a QR code</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={qrValue.name}
            onChangeText={(text) => setQRValue({ ...qrValue, name: text })}
          />
          <TextInput
           style={styles.input}
           placeholder="Phone Number"
           value={qrValue.phoneNumber}
           onChangeText={(text) => setQRValue({ ...qrValue, phoneNumber: text })}
          />
          <TextInput
           style={styles.input}
           placeholder="Link"
           value={qrValue.link}
           onChangeText={(text) => setQRValue({ ...qrValue, link: text })}
          />
          <TouchableOpacity style={styles.button} onPress={generateQRCode}>
            <Text style={styles.buttonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </View>
        }
        
        {isActive && (
          <View style={styles.qrCode}>
            <ViewShot ref={viewShotRef} options={{format:'png'}}>
            <QRCode   
              value={JSON.stringify(qrValue)} // Convert object to string for QR code
              size={200}
              color="black"
              backgroundColor="white"
            />
            </ViewShot>
            <TouchableOpacity style={{marginTop:30,paddingHorizontal:60,...styles.button}} onPress={saveQRCode}>
               <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        backgroundColor: '#eee', 
    }, 
    wrapper: { 
        backgroundColor: '#fff', 
        borderRadius: 7, 
        padding: 20, 
        shadowColor: 'rgba(0, 0, 0, 0.1)', 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 1, 
        shadowRadius: 30, 
    }, 
    title: { 
        fontSize: 21, 
        fontWeight: '500', 
        marginBottom: 10, 
        textAlign:'center'
    }, 
    description: { 
        color: '#575757', 
        fontSize: 16, 
        marginBottom: 20, 
    }, 
    input: { 
        fontSize: 18, 
        padding: 17, 
        borderWidth: 1, 
        borderColor: '#999', 
        borderRadius: 5, 
        marginBottom: 20, 
    }, 
    button: { 
        backgroundColor: '#3498DB', 
        borderRadius: 5, 
        padding: 15, 
        alignItems: 'center', 
    }, 
    buttonText: { 
        color: '#fff', 
        fontSize: 18, 
    }, 
    qrCode: { 
        marginTop: 20, 
        alignItems: 'center', 
    },

})


export default QRGenerator

