import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';


const QRScanner = () => {
  const navigation = useNavigation()
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);

  const onSuccess = (e) => {
    setScanned(true);
    setScannedData(e.data);
    console.log('Scanned data:', e.data);
  };

  const handleOpenLink = () => {
    if (scannedData && Linking.canOpenURL(scannedData)) {
      Linking.openURL(scannedData).catch(err => console.error('An error occurred', err));
    } else {
      alert('Scanned data is not a valid URL');
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorCode);
    } else {
      const imageUri = result.assets[0].uri;
      setPickedImage(imageUri);

      // Convert image to QR code
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      context.drawImage(imageBitmap, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = decode(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        setScanned(true);
        console.log('Scanned data:', qrCode.data);
      } else {
        console.log('No QR code found in image');
      }
    }
  };

  return (
    <View style={{flex:1,backgroundColor:'white',paddingHorizontal:20}}>
      <Ionicons name="arrow-back" size={24} color="black" onPress={()=>navigation.navigate('Home')}/>
      <Text style={{textAlign:'center',fontSize:25}}>QR Code Scanner</Text>
      <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.torch}
      bottomContent={
        <View style={styles.bottomContent}>
          {scannedData && (
            <View style={styles.scannedDataContainer}>
              <Text style={styles.scannedDataText}>Scanned: {scannedData}</Text>
              {scannedData.startsWith('http') && (
                <TouchableOpacity style={styles.openLinkButton} onPress={handleOpenLink}>
                  <Text style={styles.buttonText}>Open Link</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
            <Text style={styles.buttonText}>Pick Image from Gallery</Text>
          </TouchableOpacity>
          {pickedImage && (
            <Image source={{ uri: pickedImage }} style={styles.previewImage} />
          )}
        </View>
      }
      />
    </View>
  )
}
const styles = StyleSheet.create({
  textBottom: {
    color: '#fff',
    fontSize: 18,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498DB',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
})
export default QRScanner

