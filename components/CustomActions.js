import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AndroidActionSheet from './AndroidActionSheet';

//Image/Location imports
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

//Firebase imports
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
  const cancelButtonIndex = options.length - 1;

  const [showAndroidActionSheet, setShowAndroidActionSheet] = useState(false); //Android only
  const { showActionSheetWithOptions } = useActionSheet(); //iOS only


  //Determines OS and opens appropriate action sheet
  const onActionPress = () => {
    if (Platform.OS === 'ios') { //Use standard ActionSheet
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => handleOptionPress(buttonIndex)
      );
    } else {
      setShowAndroidActionSheet(true); //Show Android custom "ActionSheet"
    }
  };

  //Handles option selection from action sheet (iOS or Android)
  const handleOptionPress = async (index) => {
    switch (index) {
      case 0:
        await pickImage();
        break;
      case 1:
        await takePhoto();
        break;
      case 2:
        await getLocation();
        break;
      default:
        break;
    }
  };

  //Allows user to select an image from library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) uploadAndSendImage(result.assets[0].uri);
    }
    else Alert.alert("Permissions for library access not granted.");
  }

  //Allows user to use camera to take a photo
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) uploadAndSendImage(result.assets[0].uri);
    }
    else Alert.alert("Permissions for camera access not granted.")
  };

  //Allows user to send their location
  const getLocation = async () => {
    try {
      const permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions?.granted) {
        const myLocation = await Location.getCurrentPositionAsync({});
        if (myLocation) {
          onSend([{ location: { longitude: myLocation.coords.longitude, latitude: myLocation.coords.latitude } }]);
        } else {
          Alert.alert("Error occurred while fetching location.");
        }
      } else {
        Alert.alert("Location permissions haven't been granted.");
      }
    } catch (error) {
      console.error("Error getting location: ", error);
    }
  };

  //Function will generate a unique referece identifier for upload file
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }

  //Function handles upload image to Firebase Storage & sending image message to chat
  const uploadAndSendImage = async (imageURI) => {
    console.log(`CustomActions.js|uploadAndSendImage(): imageURI is ${imageURI}`);
    const uniqueRefString = generateReference(imageURI);
    console.log(`CustomActions.js|uploadAndSendImage(): uniqueRefString is ${uniqueRefString}`);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    });
  }

  return (
    <>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More message options"
        accessibilityHint="Lets you choose to send a message with a gallery image, camera photo or your geolocation."
        accessibilityRole="button"
        style={styles.container}
        onPress={onActionPress}
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>

      {/* Render custom Android action sheet */}
      {Platform.OS === 'android' ?
        <AndroidActionSheet
          visible={showAndroidActionSheet}
          onClose={() => setShowAndroidActionSheet(false)}
          options={options}
          onOptionPress={handleOptionPress}
        />
        : null
      }
    </>
  );
};

export default CustomActions;

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  wrapper: {
    borderRadius: 18,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 22,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});
