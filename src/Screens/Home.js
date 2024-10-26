import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
    const navigation = useNavigation()
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <TouchableOpacity style={styles.GeneratorButton}
                onPress={() => navigation.navigate('QRGenerator')}>
                <Text style={{ fontSize: 30 }}>Generate QRCode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ScannerButton}
                onPress={() => navigation.navigate('QRScanner')}>
                <Text style={{ fontSize: 30, textAlign: 'center' }}>Scan QRCode</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    GeneratorButton: {
        backgroundColor: 'orange',
        marginVertical: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    ScannerButton: {
        backgroundColor: 'orange',
        marginVertical: 40,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: 280
    }

})

export default Home

