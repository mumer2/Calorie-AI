import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function StepCounterScreen() {
  const [stepCount, setStepCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const dailyGoal = 10000;

  useEffect(() => {
    Pedometer.isAvailableAsync().then(
      result => setIsAvailable(result ? 'available' : 'unavailable'),
      error => {
        console.error(error);
        setIsAvailable('unavailable');
      }
    );

    const subscription = Pedometer.watchStepCount(result => {
      console.log('New steps counted:', result.steps);
      setStepCount(prev => prev + result.steps);
    });

    return () => subscription.remove();
  }, []);

  const progress = Math.min((stepCount / dailyGoal) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚶 Live Step Tracker</Text>
      <Text style={styles.status}>Pedometer: {isAvailable}</Text>

      {isAvailable === 'checking' ? (
        <ActivityIndicator size="large" color="#0e4d92" />
      ) : (
        <>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={progress}
            tintColor="#0e4d92"
            backgroundColor="#e0e0e0"
            lineCap="round"
            rotation={0}
          >
            {() => (
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.steps}>{stepCount}</Text>
                <Text style={styles.subtitle}>steps so far</Text>
              </View>
            )}
          </AnimatedCircularProgress>

          <Text style={styles.goal}>Goal: {dailyGoal} steps</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e1f5fe',
    padding: 10,
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#0e4d92'
  },
  status: {
    fontSize: 12, marginBottom: 10, color: '#666'
  },
  steps: {
    fontSize: 32, fontWeight: 'bold', color: '#0e4d92'
  },
  subtitle: {
    fontSize: 16, color: '#444'
  },
  goal: {
    marginTop: 10, fontSize: 16, color: '#555',fontWeight: 'bold',
  }
});
