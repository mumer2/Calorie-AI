import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';


const trainingModules = [
  {
    id: '1',
    title: '🦵 Leg Exercise',
    duration: '15 mins',
    previewImage: require('../assets//trainings/Leg.jpeg'),
    description: 'Strengthen and tone your legs with guided routines.',
    steps: [
      {
        text: 'Do 15 squats slowly',
        video: require('../assets/videos/Planks.mp4'),
      },
      {
        text: 'Perform 20 lunges (10 per leg)',
        video: require('../assets/videos/PushUps.mp4'),
      },
      {
        text: '10 calf raises on a step',
        video: require('../assets/videos/Squats.mp4'),
      },
      {
        text: 'Hold a wall sit for 30 seconds',
        video: require('../assets/videos/JumpingJacks.mp4'),
      },
    ],
  },
  {
    id: '2',
    title: '💪 Full Body Workout',
    duration: '25 mins',
        previewImage: require('../assets//trainings/ExercisePlan.jpeg'),
    description: 'Boost fitness with this full-body session.',
    steps: [
      { text: '10 pushups', video: require('../assets/videos/PushUps.mp4') },
      { text: '15 squats', video: require('../assets/videos/Squats.mp4') },
      { text: '20 jumping jacks', video: require('../assets/videos/JumpingJacks.mp4') },
      { text: '30-second plank', video: require('../assets/videos/Planks.mp4') },
    ],
  },
  {
    id: '3',
    title: '🚶 Walking Guide',
    duration: '10 mins',
       previewImage: require('../assets//trainings/WalkingGuide.jpeg'),
    description: 'Daily walking routine to improve stamina.',
    steps: [
      { text: '2 min warm-up walk', video: require('../assets/videos/Planks.mp4') },
      { text: '5 min brisk walk', video: require('../assets/videos/Planks.mp4') },
      { text: '3 min cool down', video: require('../assets/videos/Planks.mp4') },
    ],
  },
];

export default function TrainingScreen() {
  const navigation = useNavigation();

  const handleStart = (module) => {
    navigation.navigate('TrainingDetail', {
      title: module.title,
      steps: module.steps,
      duration: module.duration,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📚 Training Modules</Text>
      <FlatList
        data={trainingModules}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ✅ Use Video instead of Image */}
            <Image
              source={item.previewImage}
                style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.duration}>⏱ {item.duration}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleStart(item)}
            >
              <Text style={styles.buttonText}>Start Training</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 16},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
