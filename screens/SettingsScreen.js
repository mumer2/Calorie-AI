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
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'profile'

  useEffect(() => {
    AsyncStorage.getItem('userName').then((storedName) => {
      if (storedName) setName(storedName);
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    await AsyncStorage.setItem('userName', name.trim());
    Alert.alert('✅ Saved', 'Your name has been updated');
  };

 const handleLogout = () => {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to log out?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['authToken', 'userRole', 'userName']);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            Alert.alert('Logout Error', 'Something went wrong.');
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {activeTab === 'menu' && (
        <View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.menuText}>👤 Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleLogout}
          >
            <Text style={styles.menuText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'profile' && (
        <View style={styles.profileCard}>
          <Text style={styles.subTitle}>Edit Profile</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('menu')} style={styles.backButton}>
            <Text style={styles.backText}>Back to Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4faff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, color: '#0e4d92',textAlign: 'center' },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    color: '#0e4d92',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  backText: {
    color: '#0e4d92',
    fontSize: 14,
    textDecorationLine: 'underline',
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
