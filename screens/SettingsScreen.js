import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const [name, setName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userName').then((storedName) => {
      if (storedName) setName(storedName);
    });
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('userName', name.trim());
    Alert.alert('✅ Saved', 'Your name has been updated');
  };

  // const handleAdminLogin = () => {
  //   navigation.navigate('AdminLogin');
  // };

  const handleLogout = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'userRole', 'userName']);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    Alert.alert('Logout Error', 'Something went wrong.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Settings</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* <TouchableOpacity onPress={handleAdminLogin} style={styles.adminButton}>
        <Text style={styles.adminButtonText}>Login as Admin</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  adminButton: {
    backgroundColor: '#555',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: '#b00020',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});



// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function SettingsScreen() {
//   const [name, setName] = useState('');

//   useEffect(() => {
//     AsyncStorage.getItem('userName').then(storedName => {
//       if (storedName) setName(storedName);
//     });
//   }, []);

//   const handleSave = async () => {
//     await AsyncStorage.setItem('userName', name.trim());
//     Alert.alert('✅ Saved', 'Your name has been updated');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Personal Settings</Text>
//       <TextInput
//         value={name}
//         onChangeText={setName}
//         placeholder="Enter your name"
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={handleSave} style={styles.button}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24,marginTop: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   button: {
//     backgroundColor: '#0e4d92',
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
// });
