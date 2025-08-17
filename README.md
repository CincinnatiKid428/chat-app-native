# ![Chatty Catty Logo](assets/logo.png) *Chatty Catty* - Native Chat App

## Project Description:
To build a chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.


## 📋 Key Features:
● A page where users can enter their name, choose a background color and avatar image for the chat screen
before joining the chat.<br>
● A page displaying the conversation, as well as an input field and submit button.<br>
● The chat must provide users with two additional communication features: sending images
and location data.<br>
● Data gets stored online and offline.


## 👥 User Stories:
● As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
friends and family.<br>
● As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.<br>
● As a user, I want to send images to my friends to show them what I’m currently doing.<br>
● As a user, I want to share my location with my friends to show them where I am.<br>
● As a user, I want to be able to read my messages offline so I can reread conversations at any
time.<br>
● As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface.

<br><br>
## 📲 Using the App:
### Start Screen
Users will initially with the Start screen where they have options to choose their chat name, background color of the chat window and an avatar to be used along with their messages. 
<div align="center">
  <img src="/assets/start-screen.PNG" alt="Start screen" width="414" height="896">
</div>

### Chat Screen
After the user clicks the 'Start Chatting' button, they will be navigated to the Chat screen. Their anonymous authentication has occurred and the chat will then pull older messages from the chat from the Firestore Database, and any images from the Firebase Storage.  These will render in the chat window upon loading.
<div align="center">
  <img src="/assets/chat-screen-01.PNG" alt="Chat screen" width="414" height="896">
</div>

Tapping the input field will allow the user to type on the keybaord to enter a message, once a message has been entered they can tap 'Send' to send their message.
<div align="center">
  <img src="/assets/chat-screen-02.PNG" alt="Chat screen keyboard" width="414" height="896">
</div>
<p>
The circle with plus sign + on the left side of the text input bar is the button for other message options.  This will present a menu for choosing a photo from the device's library, taking a photo using the device's camera, sending the user's current location or cancelling the menu.  All non-cancel options will get appropriate permissions from the user prior to the app accessing the features on their device.  
  </p>
<div align="center">
  <img src="/assets/chat-screen-03.PNG" alt="Chat other message options" width="414" height="896">
</div>
Maps and images are interactive and can be tapped.  Tapping images will show the image in full size and tapping maps will open the location in the Google Maps app or on the web browser.

### Offline Status
Should the user lose their network connection, *Chatty Catty* will be usable with some limitations.  The user will be notified by an alert that their network connection has been lost. 
<div align="center">
  <img src="/assets/chat-screen-04.PNG" alt="Offline chat alert" width="414" height="896">
</div>

After that, the input field will be disabled and not visible on the screen.  The messages from the chat will all be pulled from cache using AsyncStorage to allow the user to still read messages even when offline. When the network connection has been restored, *Chatty Catty* will reconenct to the database/storage and sync the chat with any messages that were missed while offline.
<div align="center">
  <img src="/assets/chat-screen-05.PNG" alt="Offline chat mode" width="414" height="896">
</div>

<br><br>
## 🛠️ How to Set Up a *Chatty Catty* Dev Environment:
- Clone GitHub repository
- Run `npm install` from project root folder to install all dependencies
- In `firebase_config.js` replace the the following section with your Firebase config:<br>
  <img width="530" height="172" alt="image" src="https://github.com/user-attachments/assets/ec039ad1-6905-4bed-933f-de6a5c9b7115" /><br>
  (Requires Google Firebase https://console.firebase.google.com/ and setup for web app with read-write access to Firebase Storage, Firestore Database and Firestore Authentication)
  <p>
  Be sure to set Firestore Database read-write rules:<br>
  <img width="422" height="175" alt="image" src="https://github.com/user-attachments/assets/a274a8cf-cd37-4749-9a1d-20d1f1f22b70" /><br>
  And the Firebase Storage read-write rules:<br>
  <img width="637" height="192" alt="image" src="https://github.com/user-attachments/assets/5a8f14db-91cb-420f-ae2b-9c107fca5fce" />
  </p>
- In `components/Chat.js` replace the following section with your Google Maps API key:<br>
  <img width="340" height="23" alt="image" src="https://github.com/user-attachments/assets/f6e94fa1-405f-4e68-b0e2-5e0d3d3a8e8f" /><br>
  (Requires Google Maps Platform https://console.cloud.google.com/google/maps-apis with Static Maps API enabled)
-  Go to Expo's website and create an account : https://expo.dev/signup
-  On a mobile device, download the Expo Go app from the App Store (iOS) or Google Play (Android) <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/33c761b3-7d3e-4443-aefe-ee79f9c65604" />
-  Using your Expo login information:
  1. Run `npx expo login` from your project root folder and provide credentials
  2. Sign in on the Expo Go mobile app (this will allow you to use your WiFi for both server and client to run the app on a mobile device)

-  Run `npx expo start` to start the project development server.  Once the server is up, the application should appear on the Expo Go mobile app under development servers (see below).  Tap the server to download the *Chatty Catty* app onto the mobile device.  You may run multiple devices using Expo Go to simulate more users in the chat.<br>

<div align="center">
  <img width="327" height="387" alt="image" src="https://github.com/user-attachments/assets/872cdb2b-da93-4627-852a-0e9dc4430b9a" />
</div>

<br><br>
## 🚨 Known Issues:
With the current setup used in this project, Expo SDK 53 / Expo Go will not support the latest `react-native-gifted-chat` due to the `react-native-keyboard-controller` being a peer dependency.  This app uses `react-native-gifted-chat@2.4.0` to avoid having the dependency issue.  This, however, causes a runtime error/warning due to the way it is passing the `key` prop in the package and will show this error both on the mobile app screen (dismissable) and in the console:
<div align="center">
  <img width="1046" height="255" alt="image" src="https://github.com/user-attachments/assets/ca82f5d7-0c1b-4b3e-b9eb-50d9a1fae5b8" />
</div>
⚠️ Expo will be releasing SDK 54 in the near future and this codebase may need to be updated to work with the new Expo/Expo Go. 

<br><br>
## 🤖 Technologies Used (See `package.json` for specific versions)
- React Native
- Expo / Expo Go (SDK 53)
- AsyncStorage
- Google Maps, Firebase & Firestore Platforms
- RecraftAI (*Chatty Catty* background image created using RecraftAI)
  
### Dependencies
- Google Firebase Storage (image storage)
- Google Firestore Database (message storage)
- Google Firestore Authentication (OAuth)
- Google Maps Platform (static map generation)
