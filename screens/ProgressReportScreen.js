// screens/ProgressReportScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressReportScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStepHistory();
  }, []);

  const loadStepHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('stepHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sorted);
      }
    } catch (e) {
      console.error('Error loading step history', e);
    } finally {
      setLoading(false);
    }
  };

  const getSummary = () => {
    if (history.length === 0) return null;
    const total = history.reduce((sum, day) => sum + day.steps, 0);
    const average = Math.round(total / history.length);
    const bestDay = history.reduce((max, item) =>
      item.steps > max.steps ? item : max
    );

    return { total, average, bestDay };
  };

  const summary = getSummary();

 return (
  <View style={styles.container}>
    <Text style={styles.header}>📈 Progress Report</Text>

    {loading ? (
      <ActivityIndicator size="large" color="#0e4d92" />
    ) : history.length === 0 ? (
      <Text style={styles.noData}>No data yet. Start moving! 💪</Text>
    ) : (
      <>
        {summary && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>👣 Total Steps: {summary.total.toLocaleString()}</Text>
            <Text style={styles.summaryText}>📊 Avg Per Day: {summary.average.toLocaleString()}</Text>
            <Text style={styles.summaryText}>
              🏆 Best Day: {summary.bestDay.date} – {summary.bestDay.steps.toLocaleString()} steps
            </Text>
          </View>
        )}

        <Text style={styles.subheading}>📅 Step History</Text>
        <FlatList
          data={history}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.steps}>{item.steps.toLocaleString()} steps</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9ff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  steps: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e4d92',
  },
   noData: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    fontSize: 16,
  },
});
