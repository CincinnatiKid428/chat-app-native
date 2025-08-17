//components/Chat.js

import { useState, useEffect } from 'react';
import { View, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import WebView from "react-native-webview";

import styles from '../styles/styles';

//Gifted chat imports (and custom components)
import { GiftedChat, Bubble, SystemMessage, Day, InputToolbar } from 'react-native-gifted-chat';
import CustomActions from "./CustomActions";

//Firebase & cache imports
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';

/*This function takes a background color and determines the brightness of the color, then
returns black or white to be the highest contrast color for font*/
function getContrastingTextColor(bgColor) {
  // Remove hash symbol if present
  const color = bgColor.replace('#', '');

  // Parse r, g, b values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate brightness (standard formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for light backgrounds, white for dark
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

const Chat = ({ db, storage, route, isConnected, navigation }) => {

  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const userID = route.params.userID;
  const name = route.params.name;
  const selectedBgColor = route.params?.selectedBgColor || '#FFFFFF';
  const selectedAvatar = route.params?.selectedAvatar || null;
  const contrastColor = getContrastingTextColor(selectedBgColor);

  //This function will add timestamp and fields to message before adding document to Firestore DB
  const onSend = (newMessages) => {
    const messageToAdd = {
      ...newMessages[0],
      createdAt: serverTimestamp(), //Ensures proper Firestore timestamp
      user: {
        _id: userID,
        name: name,
        avatar: selectedAvatar
      }
    }
    try {
      addDoc(collection(db, "Messages"), messageToAdd);
    } catch (err) {
      Alert.alert("Unable to sent message, please try again.");
      console.error("Chat.js|onSend(): Error trying to send new message to Firestore DB: ", err);
    }
  }

  //This function will cache chat messages
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('chat_messages', JSON.stringify(messagesToCache));
      //console.log(`Chat.js|cacheMessages(): Cache updated with messages.`); //Debug
    } catch (err) {
      console.error(`Chat.js|cacheMessages(): Error storing message in cache`, err);
    }
  }

  //This function will load stored messages in cache
  const loadCachedMessages = async () => {
    try {
      const cachedChatMessages = await AsyncStorage.getItem('chat_messages');
      if (cachedChatMessages) {
        const cachedChatMessagesObj = JSON.parse(cachedChatMessages);
        setMessages(cachedChatMessagesObj);
      } else {
        console.log(`Chat.js|loadCachedMessages(): No cached messages found.`);
        setMessages([]);
      }
    } catch (err) {
      console.error(`Chat.js|loadCachedMessages(): Error loading message from cache`, err);
    }
  }

  //This function will change colors of message bubbles in the chat 
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#75d8ffff",
        },
        left: {
          backgroundColor: "#e6e6e6ff"
        }
      }}
      textStyle={{
        right: {
          color: '#000000' // Text color for sender
        },
        left: {
          color: '#000000' // Optional: for receiver
        }
      }}
      timeTextStyle={{
        right: { color: '#000', fontSize: 10 },
        left: { color: '#000', fontSize: 10 }
      }}

    />
  }

  //This function will change color of system message font based on selectedBgColor for high contrast
  const renderSystemMessage = (props) => {
    return <SystemMessage
      {...props}
      containerStyle={{ backgroundColor: selectedBgColor }}
      textStyle={{ color: contrastColor, fontWeight: '600' }}
    />
  }

  //This function will change the color of the Day header component in the chat based on selectedBgColor for high contrast
  const renderDay = (props) => {
    return <Day
      {...props}
      textStyle={{ color: contrastColor, fontWeight: 'bold' }}
    />
  }

  //This function will conditionally render InputToolbar based on network connection
  const renderInputToolbar = (props) => {
    if (isConnected === false) return null;
    else return <InputToolbar {...props} />
  }

  //Function will conditionally render custom action component button based on network connection
  const renderCustomActions = (props) => {
    if (isConnected === false) return null;
    else return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  //Funtion will handle custom views in messages (images/maps)
  const renderCustomView = (props) => {

    const { currentMessage } = props;
    if (currentMessage.location) {
      //console.log(`Chat.js|renderCustomView(): Received location message with ${JSON.stringify(currentMessage.location)}`);
      const { latitude, longitude } = currentMessage.location;
      const mapImgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=300x150&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

      //Opens link to Google maps if map image bubble is tapped
      const openMapLink = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url).catch((err) => {
          console.error("Failed to open map:", err);
          Alert.alert("Could not open map");
        });
      }

      return (
        <TouchableOpacity onPress={openMapLink}>
          <Image
            style={styles.mapImage}
            source={{ uri: mapImgUrl }}
            resizeMode='cover'
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  let unsubscribeMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    //If network connection is available...
    if (isConnected === true) {

      /*If we have an active listener already, unsubscribe and set to null
        to avoid creating additional listeners and memory leaks */
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = null;

      //Set up Snapshot listener for Firestore DB
      const q = query(collection(db, "Messages"), orderBy('createdAt', "desc"));
      unsubscribeMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach(doc => {
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date() //converts Firestore timestamp to GiftedChat format for each message
          })
        });
        //Cache new chat messages & update state var
        cacheMessages(newMessages);
        setMessages(newMessages);
      });

    } else { //Network not connected, load from cache
      loadCachedMessages();
    }

    //Slight delay added to allow for component to mount & messages to appear on Android
    const timeout = setTimeout(() => { }, 1000);

    return () => {
      clearTimeout(timeout);
      if (unsubscribeMessages) unsubscribeMessages();
    }
  }, [isConnected]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: selectedBgColor }} edges={['bottom', 'top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? null : 'padding'} // To help with keyboard covering text input
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80} // adjusted to Android physical device 
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={{ flex: 1 }}>
            <GiftedChat
              messages={messages}
              renderBubble={renderBubble}
              renderDay={renderDay}
              renderSystemMessage={renderSystemMessage}
              renderInputToolbar={renderInputToolbar}
              renderActions={renderCustomActions}
              onSend={messages => onSend(messages)}
              renderCustomView={renderCustomView}
              user={{
                _id: userID,
                name: name,
                avatar: selectedAvatar
              }}
              showUserAvatar={true}
              showAvatarForEveryMessage={false}
              renderUsernameOnMessage={true}
              enableAutomaticScroll={true}
              keyboardShouldPersistTaps="handled"
            />
          </View>

        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );

}

export default Chat;