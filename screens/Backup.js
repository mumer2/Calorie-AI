import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  AppState,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import StepCounterScreen from "./StepCounterScreen";
import ReviewRequestsScreen from "./ReviewRequestsScreen";

const STEP_GOAL = 10000;
const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation, name }) {
  const [steps, setSteps] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionMenu, setShowSubscriptionMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSubStatus = async () => {
        const status = await AsyncStorage.getItem("isSubscribed");
        setIsSubscribed(status === "true");
      };
      fetchSubStatus();
    }, [])
  );

  useEffect(() => {
    const initialize = async () => {
      const today = new Date().toDateString();
      const savedDate = await AsyncStorage.getItem("step_date");
      const savedSteps = await AsyncStorage.getItem("step_count");

      if (savedDate === today && savedSteps) {
        setSteps(parseInt(savedSteps));
      } else {
        await AsyncStorage.setItem("step_date", today);
        await AsyncStorage.setItem("step_count", "0");
        setSteps(0);
      }

      const subscription = Pedometer.watchStepCount(async (result) => {
        const newStepCount = steps + result.steps;
        setSteps(newStepCount);
        await AsyncStorage.setItem("step_count", newStepCount.toString());
      });

      AppState.addEventListener("change", handleAppStateChange);

      return () => {
        subscription?.remove();
        AppState.removeEventListener("change", handleAppStateChange);
      };
    };

    initialize();
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      const today = new Date().toDateString();
      const savedDate = await AsyncStorage.getItem("step_date");
      if (savedDate !== today) {
        await AsyncStorage.setItem("step_date", today);
        await AsyncStorage.setItem("step_count", "0");
        setSteps(0);
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const resetName = async () => {
    await AsyncStorage.removeItem("userName");
    navigation.replace("Onboarding");
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const handleToggleSubscriptionMenu = () => {
    setShowSubscriptionMenu(!showSubscriptionMenu);
  };

  const handleSubscribe = () => {
    setShowSubscriptionMenu(false);
    navigation.navigate("Subscribe");
  };

  const handleUnsubscribe = () => {
    Alert.alert(
      "Confirm Unsubscription",
      "Are you sure you want to unsubscribe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unsubscribe",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.setItem("isSubscribed", "false");
            setIsSubscribed(false);
            setShowSubscriptionMenu(false);
          },
        },
      ]
    );
  };

  const collections = [
    {
      title: "Fitness Calculation",
      image: require("../assets/fitness.png"),
      screen: "Fitness",
    },
    {
      title: "Diet Plan",
      image: require("../assets/diet.png"),
      screen: isSubscribed ? "Diet" : "Subscribe",
    },
    {
      title: "Daily Exercise",
      image: require("../assets/exercise.png"),
      screen: isSubscribed ? "Exercise" : "Subscribe",
    },
  ];

  const progress = Math.min((steps / STEP_GOAL) * 100, 100);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f0f8ff" barStyle="dark-content" />

        {/* Top Bar with Refresh and Subscription Tab */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>👋 Hi, {name}</Text>
          <View style={styles.topRightControls}>
            <TouchableOpacity onPress={resetName} style={{ marginRight: 12 }}>
              <MaterialIcons name="refresh" size={24} color="#0e4d92" />
            </TouchableOpacity>

            <View>
              <TouchableOpacity onPress={handleToggleSubscriptionMenu}>
                <MaterialIcons
                  name="stars"
                  size={24}
                  color={isSubscribed ? "#0e4d92" : "#aaa"}
                />
              </TouchableOpacity>

              {showSubscriptionMenu && (
                <View style={styles.subscriptionMenu}>
                  {isSubscribed ? (
                    <TouchableOpacity onPress={handleUnsubscribe}>
                      <Text style={styles.menuOption}>Unsubscribe ❌</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={handleSubscribe}>
                      <Text style={styles.menuOption}>Subscribe ⭐</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
        <StepCounterScreen />

        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {/* <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>👣 Steps Today</Text>
          <Text style={styles.stepCount}>{steps}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.goalText}>Goal: {STEP_GOAL} steps</Text>
        </View> */}

          <Text style={styles.sectionTitle}>Your Fitness Journey</Text>

          <View style={styles.row}>
            {collections.slice(0, 2).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  styles.halfCard,
                  index === 1 && { marginRight: 0 },
                ]}
                onPress={() => handleNavigate(item.screen)}
              >
                <Image source={item.image} style={styles.cardImageTop} />
                <Text style={styles.cardTextCentered}>
                  {item.title} {item.screen === "Subscribe" ? "🔒" : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.card, styles.fullCard]}
            onPress={() => handleNavigate(collections[2].screen)}
          >
            <Image source={collections[2].image} style={styles.cardImageTop} />
            <Text style={styles.cardTextCentered}>
              {collections[2].title}{" "}
              {collections[2].screen === "Subscribe" ? "🔒" : ""}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
  },
  scroll: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#f4f9ff",
    flexGrow: 1,
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 10,
  },
  topBarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0e4d92",
  },
  topRightControls: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  subscriptionMenu: {
    position: "absolute",
    top: 28,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 999,
    minWidth: 120,
  },
  menuOption: {
    paddingVertical: 6,
    color: "#0e4d92",
    fontWeight: "500",
  },
  stepBox: {
    backgroundColor: "#e1f5fe",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    color: "#007acc",
    marginBottom: 8,
  },
  stepCount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#004d40",
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#cce7ff",
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  progress: {
    height: "100%",
    backgroundColor: "#007acc",
    borderRadius: 8,
  },
  goalText: {
    fontSize: 14,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 14,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  halfCard: {
    flex: 1,
    marginRight: 8,
  },
  fullCard: {
    alignSelf: "stretch",
  },
  cardImageTop: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  cardTextCentered: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});


// App.js
// import React, { useEffect, useState } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { StripeProvider } from "@stripe/stripe-react-native";
// import { Ionicons } from "@expo/vector-icons";

// Screens
// import OnboardingScreen from "./screens/OnboardingScreen";
// import HomeScreen from "./screens/HomeScreen";
// import FitnessScreen from "./screens/FitnessScreen";
// import DietPlanScreen from "./screens/DietPlanScreen";
// import ExerciseScreen from "./screens/ExerciseScreen";
// import SubscribeScreen from "./screens/SubscribeScreen";
// import StepCounterScreen from "./screens/StepCounterScreen";
// import CheckInScreen from "./screens/CheckInScreen";
// import HistoryScreen from "./screens/HistoryScreen";
// import SettingsScreen from "./screens/SettingsScreen";
// import ReminderScreen from "./screens/ReminderScreen";
// import StepsHistoryScreen from "./screens/StepsHistoryScreen";
// import TrainingScreen from "./screens/TrainingScreen";
// import TrainingVideoScreen from "./screens/TrainingVideoScreen";
// import TrainingDetailScreen from "./screens/TrainingDetailScreen";
// import ProgressReportScreen from "./screens/ProgressReportScreen";
// import JitsiScreen from "./screens/JitsiScreen";
// import AIChatScreen from "./screens/AIChatScreen";
// import AdminLoginScreen from "./screens/AdminLoginScreen";
// import ReviewRequestsScreen from "./screens/ReviewRequestsScreen";
// import SubmitRequestScreen from "./screens/SubmitRequestScreen";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// Tabs navigator
// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let icon;
//           if (route.name === "Home") icon = "home-outline";
//           else if (route.name === "Check-In") icon = "checkmark-done-outline";
//           else if (route.name === "History") icon = "calendar-outline";
//           else if (route.name === "Settings") icon = "settings-outline";
//           return <Ionicons name={icon} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#0e4d92",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Check-In" component={CheckInScreen} />
//       <Tab.Screen name="History" component={HistoryScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   const [name, setName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     AsyncStorage.getItem('isAdmin').then((val) => {
//       if (val === 'true') setIsAdmin(true);
//     });
//   }, []);

//   useEffect(() => {
//     const loadName = async () => {
//       const storedName = await AsyncStorage.getItem("userName");
//       setName(storedName);
//       setLoading(false);
//     };
//     loadName();

//     const interval = setInterval(loadName, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return null;

//   return (
//     <StripeProvider publishableKey="pk_test_51RZ5xeD1MsDkTkjjPUM3jGl7wZMhXlkiF4iGc5Jdey3SvcpmtmT2TcucP00QLjHd97wCI38RM35noeM1UO3GPqTa00YrvE9E0e">
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {!name ? (
//             <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//           ) : (
//             <>
            
//               <Stack.Screen name="MainTabs" component={MainTabs} />
//               <Stack.Screen name="Fitness" component={FitnessScreen} />
//               <Stack.Screen name="Diet" component={DietPlanScreen} />
//               <Stack.Screen name="Exercise" component={ExerciseScreen} />
//               <Stack.Screen name="Subscribe" component={SubscribeScreen} />
//               <Stack.Screen name="Steps" component={StepCounterScreen} />
//               <Stack.Screen name="Reminders" component={ReminderScreen} />
//               <Stack.Screen name="StepHistory" component={StepsHistoryScreen} />
//               <Stack.Screen name="Training" component={TrainingScreen} />
//               <Stack.Screen
//                 name="TrainingDetail"
//                 component={TrainingDetailScreen}
//                 options={{ title: "Training Detail" }}
//               />
//               <Stack.Screen
//                 name="TrainingVideo"
//                 component={TrainingVideoScreen}
//               />

//               <Stack.Screen
//                 name="ProgressReport"
//                 component={ProgressReportScreen}
//                 options={{ title: "Progress Report" }}
//               />
//               <Stack.Screen name="Jitsi" component={JitsiScreen} />
//               <Stack.Screen name="AIChat" component={AIChatScreen} />



//                {isAdmin && (
//           <Stack.Screen name="ReviewRequests" component={ReviewRequestsScreen} />
//         )}

//               <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
//               <Stack.Screen name="SubmitRequest" component={SubmitRequestScreen} />
//               <Stack.Screen name="ReviewRequest" component={ReviewRequestsScreen} />


//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </StripeProvider>
//   );
// }



// ReviewRequestsScreen.js


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TextInput,
//   Modal,
// } from 'react-native';

// export default function ReviewRequestsScreen() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [adminAnswer, setAdminAnswer] = useState('');

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         'https://backend-calorieai.netlify.app/.netlify/functions/getRequests'
//       );
//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       Alert.alert('❌ Error', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = (request) => {
//     setSelectedRequest(request);
//     setAdminAnswer('');
//     setModalVisible(true);
//   };

//   const submitApproval = async () => {
//     try {
//       setUpdating(selectedRequest._id);
//       const res = await fetch(
//         'https://backend-calorieai.netlify.app/.netlify/functions/updateRequest',
//         {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             id: selectedRequest._id,
//             status: 'approved',
//             answer: adminAnswer,
//           }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('✅ Approved', 'Request has been approved.');
//         fetchRequests();
//       } else {
//         throw new Error(data.error || 'Action failed');
//       }
//     } catch (err) {
//       Alert.alert('❌ Error', err.message);
//     } finally {
//       setUpdating(null);
//       setModalVisible(false);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       setUpdating(id);
//       const res = await fetch(
//         'https://backend-calorieai.netlify.app/.netlify/functions/updateRequest',
//         {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id, status: 'rejected' }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('❌ Rejected', 'Request has been rejected.');
//         fetchRequests();
//       } else {
//         throw new Error(data.error || 'Action failed');
//       }
//     } catch (err) {
//       Alert.alert('❌ Error', err.message);
//     } finally {
//       setUpdating(null);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.user}>👤 {item.userId}</Text>
//       <Text style={styles.content}>{item.content}</Text>
//       <Text style={styles.date}>📅 {new Date(item.createdAt).toLocaleString()}</Text>
//       {item.answer && (
//         <Text style={styles.answer}>💬 Admin: {item.answer}</Text>
//       )}

//       <View style={styles.actions}>
//         <Button
//           title="✅ Approve"
//           onPress={() => handleApprove(item)}
//           disabled={updating === item._id}
//           color="#2e7d32"
//         />
//         <Button
//           title="❌ Reject"
//           onPress={() => handleReject(item._id)}
//           disabled={updating === item._id}
//           color="#d32f2f"
//         />
//       </View>

//       {updating === item._id && (
//         <ActivityIndicator size="small" color="#666" style={{ marginTop: 10 }} />
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading requests...</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//      <View style={styles.title}>
//             <Text style={{ fontSize: 20,fontWeight:'bold',color:'#0e4d92' }}>Review the Requests</Text>
//           </View>
//       <FlatList
//         data={requests}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <Text style={{ fontSize: 18, color: '#999' }}>No pending requests.</Text>
//           </View>
//         }
//       />

//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>Enter response:</Text>
//             <TextInput
//               style={styles.modalInput}
//               placeholder="Add a comment or answer..."
//               multiline
//               value={adminAnswer}
//               onChangeText={setAdminAnswer}
//             />
//             <Button title="Submit Approval" onPress={submitApproval} color="#2e7d32" />
//             <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     padding: 30,
//     alignItems: 'center',
//   },
//   card: {
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   user: {
//     fontWeight: '600',
//     fontSize: 14,
//     marginBottom: 6,
//     color: '#444',
//   },
//   content: {
//     fontSize: 16,
//     marginBottom: 6,
//     color: '#333',
//   },
//   date: {
//     fontSize: 12,
//     color: '#777',
//   },
//   answer: {
//     fontSize: 14,
//     fontStyle: 'italic',
//     color: '#005eaa',
//     marginTop: 6,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 12,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   empty: {
//     marginTop: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   modalBox: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     padding: 10,
//     height: 100,
//     marginBottom: 16,
//     textAlignVertical: 'top',
//   },
// });

