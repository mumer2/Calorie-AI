import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/login';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      return Alert.alert('Error', 'Email and password are required');
    }

    setLoading(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        // Store user info locally
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.user._id || '');
        await AsyncStorage.setItem('userName', data.user.name || '');
        await AsyncStorage.setItem('userRole', data.role);
        await AsyncStorage.setItem('userPoints', (data.user.points || 0).toString());
        await AsyncStorage.setItem('referralCode', data.user.referralCode || '');

        // Navigate to appropriate home
        if (data.role === 'member') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } else if (data.role === 'coach') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CoachHome' }],
          });
        } else {
          Alert.alert('Login Error', 'Unknown role returned from server.');
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Login as {role}</Text>

          <View style={styles.roleSwitch}>
            <TouchableOpacity onPress={() => setRole('member')}>
              <Text style={role === 'member' ? styles.selected : styles.unselected}>
                Member
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRole('coach')}>
              <Text style={role === 'coach' ? styles.selected : styles.unselected}>
                Coach
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.forgotContainer}>
  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
    <Text style={styles.forgotText}>Forgot Password?</Text>
  </TouchableOpacity>
</View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#0e4d92',
  },
  roleSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selected: {
    color: '#0e4d92',
    fontWeight: 'bold',
    marginHorizontal: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  unselected: {
    color: 'gray',
    marginHorizontal: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0e4d92',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: '#0e4d92',
    fontSize: 14,
    textAlign: 'center',
  },
forgotContainer: {
  alignItems: 'flex-end',
  marginBottom: 16,
},

forgotText: {
  color: '#0e4d92',
  fontSize: 14,
  textDecorationLine: 'underline',
},

});



// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const LOGIN_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/login';

// export default function LoginScreen({ navigation }) {
//   const [role, setRole] = useState('member');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (loading) return;

//     if (!email.trim() || !password.trim()) {
//       return Alert.alert('Error', 'Email and password are required');
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(LOGIN_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password,
//           role,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.token && data.user) {
//         await AsyncStorage.setItem('authToken', data.token);
//         await AsyncStorage.setItem('userRole', data.role);
//         await AsyncStorage.setItem('userName', data.user.name || '');
//         await AsyncStorage.setItem('userId', data.user._id || '');

//         if (data.role === 'member') {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'MainTabs' }],
//           });
//         } else if (data.role === 'coach') {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'CoachHome' }],
//           });
//         } else {
//           Alert.alert('Login Error', 'Unknown role returned from server.');
//         }
//       } else {
//         Alert.alert('Login Failed', data.message || 'Login failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert('Error', 'Could not connect to server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.wrapper}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Login as {role}</Text>

//           <View style={styles.roleSwitch}>
//             <TouchableOpacity onPress={() => setRole('member')}>
//               <Text style={role === 'member' ? styles.selected : styles.unselected}>
//                 Member
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setRole('coach')}>
//               <Text style={role === 'coach' ? styles.selected : styles.unselected}>
//                 Coach
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#999"
//             style={styles.input}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//           />

//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#999"
//             style={styles.input}
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//           />

//           <TouchableOpacity style={styles.button} onPress={handleLogin}>
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Login</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//             <Text style={styles.link}>Don't have an account? Sign up</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     backgroundColor: '#f0f8ff',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 24,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#0e4d92',
//   },
//   roleSwitch: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   selected: {
//     color: '#0e4d92',
//     fontWeight: 'bold',
//     marginHorizontal: 10,
//     fontSize: 16,
//     textDecorationLine: 'underline',
//   },
//   unselected: {
//     color: 'gray',
//     marginHorizontal: 10,
//     fontSize: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#0e4d92',
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   link: {
//     marginTop: 20,
//     color: '#0e4d92',
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });
