import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';

export default function StepCounterScreen() {
  const [stepCount, setStepCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const navigation = useNavigation(); // ✅ correct hook used here

  const dailyGoal = 10000;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    checkPedometer();
    loadTodaySteps();

    const subscription = Pedometer.watchStepCount(result => {
      setStepCount(prev => prev + result.steps);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    saveTodaySteps();
  }, [stepCount]);

  const checkPedometer = async () => {
    try {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available ? 'available' : 'unavailable');
    } catch {
      setIsAvailable('unavailable');
    }
  };

  const loadTodaySteps = async () => {
    try {
      const stored = await AsyncStorage.getItem('stepHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        const todayEntry = parsed.find(entry => entry.date === today);
        if (todayEntry) setStepCount(todayEntry.steps);
      }
    } catch (e) {
      console.log('Failed to load step history:', e);
    }
  };

  const saveTodaySteps = async () => {
    try {
      const stored = await AsyncStorage.getItem('stepHistory');
      let updated = [];

      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter(entry => entry.date !== today);
        updated = [...filtered, { date: today, steps: stepCount }];
      } else {
        updated = [{ date: today, steps: stepCount }];
      }

      await AsyncStorage.setItem('stepHistory', JSON.stringify(updated));
    } catch (e) {
      console.log('Failed to save step history:', e);
    }
  };

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
                <Text style={styles.subtitle}>steps today</Text>
              </View>
            )}
          </AnimatedCircularProgress>

        <View style={styles.goalRow}>
  <Text style={styles.goal}>Goal: {dailyGoal} steps</Text>
  <TouchableOpacity onPress={() => navigation.navigate('StepHistory')}>
    <Text style={styles.historyIcon}>📊</Text>
  </TouchableOpacity>
</View>

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
    fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#0e4d92',
  },
  status: {
    fontSize: 14, marginBottom: 10, color: '#666',
  },
  steps: {
    fontSize: 32, fontWeight: 'bold', color: '#0e4d92',
  },
  subtitle: {
    fontSize: 16, color: '#444',
  },
  goal: {
    marginTop: 10, fontSize: 16, color: '#555', fontWeight: 'bold',
  },
  historyButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0e4d92',
    borderRadius: 8,
  },
  historyText: {
    color: '#fff',
    fontWeight: '600',
  },
 goalRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  width: '90%',
},

goal: {
  fontSize: 16,
  color: '#555',
  fontWeight: 'bold',
},

historyIcon: {
  fontSize: 22,
  color: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
},


});






