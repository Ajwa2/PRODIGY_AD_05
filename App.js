import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/Screens/Home';
import QRGenerator from './src/Screens/QRGenerator';
import QRScanner from './src/Screens/QRScanner';



const App = () => {
  const Stack = createStackNavigator();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
           <Stack.Screen name="Home" component={Home} />
           <Stack.Screen name="QRGenerator" component={QRGenerator} />
           <Stack.Screen name="QRScanner" component={QRScanner} />  
        </Stack.Navigator>
    </NavigationContainer>
    </>
  )
}

export default App

const styles = StyleSheet.create({})