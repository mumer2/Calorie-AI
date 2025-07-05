import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const GET_POINTS_URL =
"https://backend-calorieai.netlify.app/.netlify/functions/get-points";

export default function CoinsRewardScreen() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const savedCode = await AsyncStorage.getItem("referralCode");
        if (savedCode) setReferralCode(savedCode);

        if (!userId) {
          setLoading(false);
          return Alert.alert("Error", "User not logged in.");
        }

        const res = await fetch(`${GET_POINTS_URL}?userId=${userId}`);
        const data = await res.json();

        if (res.ok) {
          setPoints(data.coins || 0);
        } else {
          Alert.alert("Error", data.message || "Could not fetch coins");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        Alert.alert("Error", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const shareReferral = async () => {
    try {
      await Share.share({
        message: `🎁 Join CalorieAI and earn coins! Use my referral code: ${referralCode || "XXXXXX"}`,
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  return (
    <LinearGradient colors={["#f6f9ff", "#dbeeff"]} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="trophy" size={64} color="#f39c12" style={styles.icon} />
        <Text style={styles.title}>My Coins</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0e4d92" />
        ) : (
          <>
            <Text style={styles.coins}>{points}</Text>
            <Text style={styles.coinsLabel}>Coins Earned</Text>

            <TouchableOpacity style={styles.button} onPress={shareReferral}>
              <Ionicons name="share-social" size={18} color="#fff" />
              <Text style={styles.buttonText}>Refer a Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2ecc71" }]}
              onPress={() => navigation.navigate("RedeemScreen")}
            >
              <Ionicons name="gift" size={18} color="#fff" />
              <Text style={styles.buttonText}>Redeem Rewards</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0e4d92",
    marginBottom: 10,
  },
  coins: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#f39c12",
    marginTop: 10,
  },
  coinsLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0e4d92",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});
