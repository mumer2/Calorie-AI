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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import StepCounterScreen from "./StepCounterScreen";

const STEP_GOAL = 10000;
const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [steps, setSteps] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionMenu, setShowSubscriptionMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const storedName = await AsyncStorage.getItem("userName");
        const status = await AsyncStorage.getItem("isSubscribed");
        if (storedName) setName(storedName);
        setIsSubscribed(status === "true");
      };
      fetchUserData();
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
  useEffect(() => {
  const unsubscribe = navigation.addListener('focus', async () => {
    const status = await AsyncStorage.getItem("isSubscribed");
    setIsSubscribed(status === "true");
  });

  return unsubscribe;
}, [navigation]);


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
      title: "Daily Workout",
      image: require("../assets/exercise.png"),
      screen: isSubscribed ? "Exercise" : "Subscribe",
    },
    {
      title: "Reminders",
      image: require("../assets/Reminder.png"),
      screen: "Reminders",
    },
    {
      title: "Workout Guide",
      image: require("../assets/classroom.png"),
      screen: isSubscribed ? "Training" : "Subscribe",
    },
    {
      title: "Progress Report",
      image: require("../assets/progress-report.png"),
      screen: "ProgressReport",
    },
    {
      title: "Live Video",
      image: require("../assets/live.png"),
      screen: "CoachVideoList",
    },
    {
      title: "AI Chat",
      image: require("../assets/live-chat.png"),
      screen: "AIChat",
    },
    {
      title: "Send Request To Coach",
      image: require("../assets/ask-question.png"),
      screen: "CoachList",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      {/* Fixed Top Bar */}
      <SafeAreaView style={styles.fixedTopBarContainer}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>👋 Hi, {name || "Guest"}</Text>
          <View style={styles.topRightControls}>
            <TouchableOpacity
              style={styles.coinTab}
              onPress={() => navigation.navigate("CoinsReward")}
            >
              <Text style={styles.coinTabText}>🪙</Text>
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
      </SafeAreaView>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 100,
          paddingBottom: 40,
        }}
      >
        <StepCounterScreen />

        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
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
          {/* <View style={styles.row}>
            {collections.slice(2, 4).map((item, index) => (
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
                <Text style={styles.cardTextCentered}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View> */}

          <View style={styles.row}>
            {collections.slice(2,4).map((item, index) => (
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
          <View style={styles.row}>
            {collections.slice(4, 6).map((item, index) => (
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

          <View style={styles.row}>
            {collections.slice(6, 8).map((item, index) => (
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
          <View style={styles.row}>
            {collections.slice(8).map((item, index) => (
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
          {/* {collections.slice(2).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, styles.halfCard,]}
              onPress={() => handleNavigate(item.screen)}
            >
              <Image source={item.image} style={styles.cardImageTop} />
              <Text style={styles.cardTextCentered}>{item.title}</Text>
            </TouchableOpacity>
          ))} */}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedTopBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 2,
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
  coinTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  coinTabText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 3,
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
