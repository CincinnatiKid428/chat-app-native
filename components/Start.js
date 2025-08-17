// components/Start.js

import { useEffect, useState } from 'react';
import { ImageBackground, View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import styles from '../styles/styles';

//Import Firebase auth from config file
import { auth } from '../firebase_config';
import { signInAnonymously } from "firebase/auth";

//Start screen background image
const bgImage = require('../assets/bg-image.png');

//Holds static array of background color choices for chat screen
//Add more colors to this array for additional choices
const colorChoices = [
  '#090C08',
  '#474056',
  '#8A95A5',
  '#B9C6AE',
  '#ffe1b3ff',
  '#022349ff',
  '#1a3a00ff',
  '#883d82ff'
];

//Holds static array of avatar choices for chat screen
const avatarChoices = [
  'https://static.vecteezy.com/system/resources/thumbnails/034/721/323/small_2x/ai-generated-cute-cat-avatar-icon-clip-art-sticker-decoration-simple-background-free-photo.jpg',
  'https://leblogdechatnoir.fr/wp-content/uploads/2016/10/Avatar-Chat-noir-Fanny-C-300x300.jpeg',
  'https://img.buzzfeed.com/buzzfeed-static/static/avatars/tabby_large.jpg',
  'https://static.vecteezy.com/system/resources/previews/059/016/446/non_2x/cat-head-cute-cats-faces-cat-heads-emoticons-kitten-face-expressions-pet-appreciation-concept-vector.jpg',
  'https://st2.depositphotos.com/3058647/6243/v/450/depositphotos_62434599-stock-illustration-stylized-cat-icon-on-white.jpg',
  'https://thumbs.dreamstime.com/z/cartoon-ingwer-tabby-katzengesicht-katze-gesichtszeichnung-niedlich-orange-kitty-portrait-vektor-clip-art-illustration-220611904.jpg?w=360'
]


/*Function renders the Start screen for the application*/
const StartScreen = ({ navigation }) => {

  //State variables
  const [name, setName] = useState(''); //Tracks chat name for user
  const [selectedBgColor, setSelectedBgColor] = useState('#ffffff'); //Tracks background color selected by user (or default white)
  const [avatar, setAvatar] = useState(null); //Tracks avatar selected by user

  //Function will allow user anonymous authentication
  const signInUser = async () => {
    try {
      const authResult = await signInAnonymously(auth);
      if (authResult) {
        navigation.navigate("Chat", {
          userID: authResult.user.uid,
          name: name,
          selectedBgColor: selectedBgColor,
          selectedAvatar: avatar
        });

      } else {
        Alert.alert("Unable to sign in to chat, please try again later.");
      }
    } catch (err) {
      console.error("Unable to sign in with error: ", err);
      Alert.alert("Error with signing into chat, please try again later.");
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: '' });
  }, []);

  return (
    <View style={Platform.OS === 'android' ? [styles.container, styles.containerAndroidBottomMargin] : styles.container}>
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={styles.backgroundImage}
      >

        <View style={styles.startTitleBox}>
          <Text style={[styles.textAppTitle, styles.fontBold]}>Chatty Catty</Text>
        </View>

        <View style={styles.startSelectionsBox}>

          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your Name'
          />

          {/*Background color selection components\*/}
          <View style={styles.userInput}>
            <Text style={styles.userInputText}>Choose Background Color:</Text>

            {/*Map colorChoices array into swatch components*/}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.swatchBox}
            >
              {colorChoices.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedBgColor(color)}
                  style={[
                    styles.circleSwatch,
                    { backgroundColor: color },
                    selectedBgColor === color ? styles.selectedSwatchBorder : null
                  ]}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.userInput}>
            <Text style={styles.userInputText}>Choose Chat Avatar:</Text>

            {/*Map avatarChoices array into swatch components*/}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.swatchBox}
            >
              {avatarChoices.map((avatarURL, index) => (
                <TouchableOpacity key={index} onPress={() => setAvatar(avatarURL)}>
                  <Image
                    source={{ uri: avatarURL }}
                    style={[
                      styles.circleSwatch,
                      avatar === avatarURL ? styles.selectedSwatchBorder : null
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.startChattingButton}
            onPress={signInUser}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </View>
  );
}

export default StartScreen;