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
