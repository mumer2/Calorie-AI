import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const exercises = [
  {
    name: 'Squats',
    video: require('../assets/videos/Squats.mp4'),
    duration: '15 reps',
  },
  {
    name: 'Push-ups',
    video: require('../assets/videos/Push Ups.mp4'),
    duration: '12 reps',
  },
  {
    name: 'Plank',
    video: require('../assets/videos/Planks.mp4'),
    duration: '45 sec',
  },
   {
    name: 'Jumping Jacks',
    video: require('../assets/videos/Jumping Jacks.mp4'),
    duration: '30 sec',
  },
];

export default function ExerciseScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏋️ Daily Workout</Text>

      {exercises.map((exercise, idx) => (
        <View key={idx} style={styles.card}>
          <Video
            source={exercise.video}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
          <View style={styles.textBox}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.duration}>⏱ {exercise.duration}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  video: {
    width: width - 40,
    height: (width - 40) * 0.6,
    borderRadius: 10,
  },
  textBox: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
