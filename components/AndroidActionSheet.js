// components/AndroidActionSheet.js

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalComponent from 'react-native-modal';

const AndroidActionSheet = ({ visible, onClose, options, onOptionPress }) => {

  return (
    <ModalComponent
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.sheet}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onOptionPress(index);
              onClose();
            }}
            style={styles.option}
          >
            <Text style={styles.text}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 20,
  },
  option: {
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AndroidActionSheet;
