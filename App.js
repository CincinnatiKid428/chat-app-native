import { useFonts } from 'expo-font';

import { useEffect } from 'react';
import { Alert } from 'react-native';

//Firebase storage / Firestore DB related imports
import { db, storage } from "./firebase_config";
import { useNetInfo } from '@react-native-community/netinfo';
import { disableNetwork, enableNetwork } from 'firebase/firestore';

//Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

//Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

export default function App() {

  const connectionStatus = useNetInfo();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Italic': require('./assets/fonts/Poppins/Poppins-Italic.ttf')
  });

  useEffect(() => {

    //Disable/Enable Firestore DB connection attempts based on network status
    if (connectionStatus.isConnected === false) {
      Alert.alert(`Connection lost!`);
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      console.log(`Connection restored...`);
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
      >
        <Stack.Screen
          name="StartScreen"
          component={Start}
        />

        <Stack.Screen name="Chat">
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>

  );
}
