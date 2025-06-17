// App.js
import 'expo-dev-client';
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Ionicons } from "@expo/vector-icons";

// Screens
import OnboardingScreen from "./screens/OnboardingScreen";
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs navigator
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
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      setName(storedName);
      setLoading(false);
    };
    loadName();

    const interval = setInterval(loadName, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <StripeProvider publishableKey="pk_test_51RZ5xeD1MsDkTkjjPUM3jGl7wZMhXlkiF4iGc5Jdey3SvcpmtmT2TcucP00QLjHd97wCI38RM35noeM1UO3GPqTa00YrvE9E0e">
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!name ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Fitness" component={FitnessScreen} />
              <Stack.Screen name="Diet" component={DietPlanScreen} />
              <Stack.Screen name="Exercise" component={ExerciseScreen} />
              <Stack.Screen name="Subscribe" component={SubscribeScreen} />
              <Stack.Screen name="Steps" component={StepCounterScreen} />
              <Stack.Screen name="Reminders" component={ReminderScreen} />
              <Stack.Screen name="StepHistory" component={StepsHistoryScreen} />
              <Stack.Screen name="Training" component={TrainingScreen} />
              <Stack.Screen
                name="TrainingVideo"
                component={TrainingVideoScreen}
              />
              <Stack.Screen
                name="TrainingDetail"
                component={TrainingDetailScreen}
                options={{ title: "Training Detail" }}
              />

               <Stack.Screen
    name="ProgressReport"
    component={ProgressReportScreen}
    options={{ title: 'Progress Report' }}
  />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
