import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';

const meals = [
  {
    title: '🍳 Breakfast',
    image: require('../assets/BreakFast.jpeg'),
    items: [
      'Oats with milk & fruits - 350 kcal',
      'Boiled eggs & toast - 300 kcal',
      'Greek yogurt & nuts - 250 kcal',
    ],
  },
  {
    title: '🍛 Lunch',
    image: require('../assets/Lunch.jpeg'),
    items: [
      'Grilled chicken with rice & veggies - 500 kcal',
      'Dal, roti, salad - 450 kcal',
      'Quinoa with chickpeas - 400 kcal',
    ],
  },
  {
    title: '🍲 Dinner',
    image: require('../assets/Dinner.jpeg'),
    items: [
      'Stir-fried tofu with brown rice - 450 kcal',
      'Paneer salad bowl - 400 kcal',
      'Soup with whole grain bread - 350 kcal',
    ],
  },
  {
    title: '🍌 Snacks',
    image: require('../assets/Snacks.jpeg'),
    items: [
      'Fruit smoothie - 200 kcal',
      'Nuts & dry fruits - 150 kcal',
      'Boiled corn or sprouts - 100 kcal',
    ],
  },
];

export default function DietPlanScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>🥗 Recommended Diet Plan</Text>
      {meals.map((meal, index) => (
       <View key={index} style={styles.card}>
  <View style={styles.mealRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{meal.title}</Text>
      {meal.items.map((item, idx) => (
        <Text key={idx} style={styles.item}>• {item}</Text>
      ))}
    </View>
    <Image source={meal.image} style={styles.mealImage} />
  </View>
</View>

      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  item: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  marginLeft: 12,
  },
  mealRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
});
