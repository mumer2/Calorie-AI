// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';
import Toast from "react-native-toast-message";

// Screens
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import FitnessScreen from "./screens/FitnessScreen";
import DietPlanScreen from "./screens/DietPlanScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import SubscribeScreen from "./screens/SubscribeScreen";
import StepCounterScreen from "./screens/StepCounterScreen";
import CheckInScreen from "./screens/CheckInScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ReminderScreen from "./screens/ReminderScreen";
import StepsHistoryScreen from "./screens/StepsHistoryScreen";
import TrainingScreen from "./screens/TrainingScreen";
import TrainingVideoScreen from "./screens/TrainingVideoScreen";
import TrainingDetailScreen from "./screens/TrainingDetailScreen";
import ProgressReportScreen from "./screens/ProgressReportScreen";
import JitsiScreen from "./screens/JitsiScreen";
import AIChatScreen from "./screens/AIChatScreen";
import ReviewRequestsScreen from "./screens/ReviewRequestsScreen";
import CoachHomeScreen from "./screens/CoachHomeScreen";
import CoachListScreen from "./screens/CoachListScreen";
import CoachProfileScreen from "./screens/CoachProfileScreen";
import SendRequestScreen from "./screens/SendRequestScreen";
import CoachVideoListScreen from "./screens/CoachVideoListScreen";
import CoachLiveScreen from "./screens/CoachLiveScreen";
import CoinsRewardScreen from "./screens/CoinsRewardScreen";
import RedeemScreen from "./screens/RedeemScreen";
import WeChatPayScreen from "./screens/WeChatPayScreen";
import SubscribeWithCoins from "./screens/SubscribeWithCoins";
import SubscriptionSuccessScreen from "./screens/SubscriptionSuccessScreen";
import { navigationRef } from "./screens/NavigationService";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === "Home") icon = "home-outline";
          else if (route.name === "Check-In") icon = "checkmark-done-outline";
          else if (route.name === "History") icon = "calendar-outline";
          else if (route.name === "Settings") icon = "settings-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0e4d92",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Check-In" component={CheckInScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'member', 'coach', 'admin'

  Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const screen = response.notification.request.content.data?.screen;
    if (screen === 'Replies') {
      navigation.navigate('CoachList'); // or navigate to specific coach
    }
  });

  return () => subscription.remove();
}, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const role = await AsyncStorage.getItem("userRole");
      setUserToken(token);
      setUserRole(role);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <StripeProvider publishableKey="pk_test_51RZ5xeD1MsDkTkjjPUM3jGl7wZMhXlkiF4iGc5Jdey3SvcpmtmT2TcucP00QLjHd97wCI38RM35noeM1UO3GPqTa00YrvE9E0e">
      <NavigationContainer  ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={userToken ? "MainTabs" : "Login"}
        >
          {/* Public Screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          {/* Authenticated User Screens */}
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="CoachHome" component={CoachHomeScreen} />
          <Stack.Screen name="Fitness" component={FitnessScreen} />
          <Stack.Screen name="Diet" component={DietPlanScreen} />
          <Stack.Screen name="Exercise" component={ExerciseScreen} />
          <Stack.Screen name="Subscribe" component={SubscribeScreen} />
          <Stack.Screen name="Steps" component={StepCounterScreen} />
          <Stack.Screen name="Reminders" component={ReminderScreen} />
          <Stack.Screen name="StepHistory" component={StepsHistoryScreen} />
          <Stack.Screen name="Training" component={TrainingScreen} />
          <Stack.Screen
            name="TrainingDetail"
            component={TrainingDetailScreen}
          />
          <Stack.Screen name="TrainingVideo" component={TrainingVideoScreen} />
          <Stack.Screen
            name="ProgressReport"
            component={ProgressReportScreen}
          />
          <Stack.Screen name="Jitsi" component={JitsiScreen} />
          <Stack.Screen name="AIChat" component={AIChatScreen} />
          <Stack.Screen
            name="ReviewRequests"
            component={ReviewRequestsScreen}
          />
          <Stack.Screen name="CoachList" component={CoachListScreen} />
          <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
          <Stack.Screen name="SendRequest" component={SendRequestScreen} />
          <Stack.Screen name="CoachVideoList" component={CoachVideoListScreen} />
          <Stack.Screen name="CoachLiveScreen" component={CoachLiveScreen} />
          <Stack.Screen name="CoinsReward" component={CoinsRewardScreen} />
          <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
          <Stack.Screen name="WeChatPay" component={WeChatPayScreen} />
          <Stack.Screen name="SubwithCoins" component={SubscribeWithCoins} />
          <Stack.Screen name="SubscriptionSuccess" component={SubscriptionSuccessScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />


        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
