import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGNUP_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/signup';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReferral = async () => {
      const code = await AsyncStorage.getItem('referralCode');
      if (code) setReferralCode(code);
    };
    loadReferral();
  }, []);

  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d).{6,}$/;

    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Error', 'All fields are required');
    }

    if (!emailRegex.test(email.trim())) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address');
    }

    if (!passwordRegex.test(password)) {
      return Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters and include at least one digit'
      );
    }

    setLoading(true);

    try {
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          referralCode: referralCode.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.userId) {
        await AsyncStorage.setItem('userName', name.trim());
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userPoints', data.points?.toString() || '50'); // fallback
        await AsyncStorage.setItem('referralCode', data.referralCode || '');
        await AsyncStorage.removeItem('referralCode'); // clean up saved referral if any

        Alert.alert('🎉 Account Created', `You earned ${data.points || 50} points for signing up!`);
        navigation.replace('Login');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong. Try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.roleSwitch}>
          <TouchableOpacity onPress={() => setRole('member')}>
            <Text style={role === 'member' ? styles.selected : styles.unselected}>Member</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole('coach')}>
            <Text style={role === 'coach' ? styles.selected : styles.unselected}>Coach</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.hintText}>
          Password must be at least 6 characters and include a number.
        </Text>

        <TextInput
          placeholder="Referral Code (optional)"
          style={styles.input}
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e4d92',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  selected: {
    backgroundColor: '#e6f0ff',
    padding: 6,
    borderRadius: 8,
    color: '#0e4d92',
    fontWeight: 'bold',
    fontSize: 16,
  },
  unselected: {
    color: '#888',
    padding: 6,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 14,
  },
  hintText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    color: '#0e4d92',
    textAlign: 'center',
    fontSize: 14,
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
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SIGNUP_URL = 'https://backend-calorieai.netlify.app/.netlify/functions/signup';

// export default function SignupScreen({ navigation }) {
//   const [name, setName] = useState('');
//   const [role, setRole] = useState('member');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^(?=.*\d).{6,}$/;

//     if (!name.trim() || !email.trim() || !password.trim()) {
//       return Alert.alert('Error', 'All fields are required');
//     }

//     if (!emailRegex.test(email.trim())) {
//       return Alert.alert('Invalid Email', 'Please enter a valid email address');
//     }

//     if (!passwordRegex.test(password)) {
//       return Alert.alert(
//         'Weak Password',
//         'Password must be at least 6 characters and include at least one digit'
//       );
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(SIGNUP_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: name.trim(),
//           email: email.trim().toLowerCase(),
//           password,
//           role,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.userId) {
//         await AsyncStorage.setItem('userName', name.trim());
//         await AsyncStorage.setItem('userId', data.userId);
//         await AsyncStorage.setItem('userRole', role);

//         Alert.alert('Success', 'Account created. Please login.');
//         navigation.replace('Login');
//       } else {
//         Alert.alert('Signup Failed', data.message || 'Something went wrong. Try again.');
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       Alert.alert('Error', 'Could not connect to server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}
//     >
//       <View style={styles.card}>
//         <Text style={styles.title}>Create Account</Text>

//         <View style={styles.roleSwitch}>
//           <TouchableOpacity onPress={() => setRole('member')}>
//             <Text style={role === 'member' ? styles.selected : styles.unselected}>Member</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setRole('coach')}>
//             <Text style={role === 'coach' ? styles.selected : styles.unselected}>Coach</Text>
//           </TouchableOpacity>
//         </View>

//         <TextInput
//           placeholder="Full Name"
//           style={styles.input}
//           value={name}
//           onChangeText={setName}
//         />
//         <TextInput
//           placeholder="Email"
//           style={styles.input}
//           autoCapitalize="none"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <TextInput
//           placeholder="Password"
//           style={styles.input}
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />
//         <Text style={styles.hintText}>
//           Password must be at least 6 characters and include a number.
//         </Text>

//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.6 }]}
//           onPress={handleSignup}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? 'Signing Up...' : 'Sign Up'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <Text style={styles.link}>Already have an account? Log in</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#eef6fb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   card: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#0e4d92',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   roleSwitch: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 16,
//     gap: 16,
//   },
//   selected: {
//     backgroundColor: '#e6f0ff',
//     padding: 6,
//     borderRadius: 8,
//     color: '#0e4d92',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   unselected: {
//     color: '#888',
//     padding: 6,
//     fontSize: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#fafafa',
//     marginBottom: 14,
//   },
//   hintText: {
//     color: '#888',
//     fontSize: 12,
//     marginBottom: 10,
//     marginLeft: 4,
//   },
//   button: {
//     backgroundColor: '#0e4d92',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   link: {
//     marginTop: 16,
//     color: '#0e4d92',
//     textAlign: 'center',
//     fontSize: 14,
//   },
// });
