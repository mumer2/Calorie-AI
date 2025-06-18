// screens/TrainingDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Video } from 'expo-av'; // ✅ NEW

// Import static cover images
import legCover from '../assets/trainings/Leg.jpeg';
import fullBodyCover from '../assets/trainings/ExercisePlan.jpeg';
import walkCover from '../assets/trainings/WalkingGuide.jpeg';

export default function TrainingDetailScreen({ route, navigation }) {
  const { title, steps, duration, image, videoPreview } = route.params;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isLastStep = currentStepIndex === steps.length - 1;
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (isLastStep) {
      Alert.alert('🎉 Completed!', `You have finished "${title}"!`);
      navigation.goBack();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Select cover image dynamically based on title
  const getCoverImage = () => {
    if (title.includes('Leg')) return legCover;
    if (title.includes('Full')) return fullBodyCover;
    if (title.includes('Walking')) return walkCover;
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Optional video preview at top */}
      {videoPreview && (
        <Video
          source={videoPreview}
          style={styles.headerVideo}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.duration}>⏱ Duration: {duration}</Text>

      {/* Dynamically selected cover image */}
      {getCoverImage() && (
        <Image source={getCoverImage()} style={styles.coverImage} />
      )}

      {/* Step Content */}
      <View style={styles.stepBox}>
        <Text style={styles.stepLabel}>
          Step {currentStepIndex + 1} of {steps.length}
        </Text>
        <Text style={styles.stepText}>{currentStep.text}</Text>

        {currentStep.video && (
          <Video
            source={currentStep.video}
            style={styles.stepVideo}
            useNativeControls
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted={false}


          />
        )}

        {currentStep.image && (
          <Image source={currentStep.image} style={styles.stepImage} />
        )}
      </View>

      {/* Navigation Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {isLastStep ? '✅ Finish Training' : '➡️ Next Step'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9ff',
    padding: 20,
  },
  headerVideo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e4d92',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  stepBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  stepLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  stepVideo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 12,
  },
  stepImage: {
    width: '100%',
    height: 180,
    marginTop: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#0e4d92',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
