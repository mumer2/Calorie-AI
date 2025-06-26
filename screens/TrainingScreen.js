import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

const trainingModules = [
  {
    id: "1",
    title: "🦵 Leg Exercise",
    duration: "25 mins",
    previewImage: require("../assets//trainings/Leg.jpeg"),
    description: "Strengthen and tone your legs with guided routines.",
    steps: [
      {
        text: "Stand on the floor, put your hands in front of you and do 16 Hops from side to side",
        video: require("../assets/videos/SideHop.mp4"),
        stepsduration: '16 reps',
      },
      {
        text: "Stand with feet shoulder-width apart, lower into a squat and do 12 Squats",
        video: require("../assets/videos/Squats2.mp4"),
        stepsduration: '12 reps',
      },
      {
        text: "Lie on your left side, lift your right leg up and do 16 Side Lying Leg Lifts",
        video: require("../assets/videos/SideLyingLegLiftLeft3.mp4"),
        stepsduration: '16 reps',
      },
      {
        text: "Lie on your right side, lift your left leg up and do 16 Side Lying Leg Lifts",
        video: require("../assets/videos/SideLyingLegLiftRight4.mp4"),
        stepsduration: '16 reps',
      },
      {
        text: "Stand with feet together, step back with your right leg and do 10 Reverse Lunges",
        video: require("../assets/videos/BackwardLounge5.mp4"),
        stepsduration: '10 reps',
      },
      {
        text: "Lie on your left side, lift your right leg up and do 12 Side Lying Leg Lifts",
        video: require("../assets/videos/DonkeyKicksLeft6.mp4"),
        stepsduration: '12 reps',
      },
      {
        text: "Lie on your right side, lift your left leg up and do 12 Side Lying Leg Lifts",
        video: require("../assets/videos/DonkeyKicksRight7.mp4"),
        stepsduration: '12 reps',
      },
      {
        text: "Stand with your back against a wall, bend your Left knees and hold for 30 seconds",
        video: require("../assets/videos/LeftQuadStretchWithWall8.mp4"),
        stepsduration: '30 sec',
      },
      {
        text: "Stand with your back against a wall, bend your Right knees and hold for 30 seconds",
        video: require("../assets/videos/RightQuadStretchWithWall9.mp4"),
        stepsduration: '30 sec',
      },
      {
        text: "Lie on your left side, lift your right leg up and do 16 Side Lying Leg Lifts",
        video: require("../assets/videos/KneeToChestStretchLeft10.mp4"),
        stepsduration: '30 sec',
      },
      {
        text: "Lie on your right side, lift your left leg up and do 16 Side Lying Leg Lifts ",
        video: require("../assets/videos/KneeToChestStretchRight11.mp4"),
        stepsduration: '30 sec',
      },
    ],
  },
  {
    id: "2",
    title: "💪 Full Body Workout",
    duration: "30 mins",
    previewImage: require("../assets//trainings/ExercisePlan.jpeg"),
    description: "Boost fitness with this full-body session.",
    steps: [
      { text: "Start with your feet shoulder-width apart, arms at your sides, and do 20 jumping jacks", 
        video: require("../assets/videos/JumpingJacks.mp4"),
        stepsduration: '20 reps',
      },
      { text: "Start in the regular push up position, but with hands elevated on a bench or step, and do 10 incline push ups", 
        video: require("../assets/videos/InclinePushUps2.mp4"),
        stepsduration: '10 reps', 
      },
      {
        text: "Start in the regular push up position, but with knees on the ground, and do 10 knee push ups",
        video: require("../assets/videos/KneePushUps.mp4"),
        stepsduration: '10 reps',
      },
      {
        text: "Lay prone on the ground with arms supporting your body.Keep your body straight while raising and lowering you body with your arms, and do 10 push ups",
        video: require("../assets/videos/PushUps.mp4"),
        stepsduration: '10 reps',
      },
       {
        text: "Start in the regular push up position but with your hands wider than shoulder-width apart, and do 10 wide arm push ups",
        video: require("../assets/videos/WideArmPushUps.mp4"),
        stepsduration: '10 reps',
      }, 
       {
        text: "Stand with feet shoulder-width apart, lower into a squat and do 12 Squats",
        video: require("../assets/videos/Squats2.mp4"),
        stepsduration: '12 reps',
      },
        {
        text: "Lie on your left side, lift your right leg up and do 16 Side Lying Leg Lifts",
        video: require("../assets/videos/SideLyingLegLiftLeft3.mp4"),
        stepsduration: '16 reps',
      },
      {
        text: "Lie on your right side, lift your left leg up and do 16 Side Lying Leg Lifts",
        video: require("../assets/videos/SideLyingLegLiftRight4.mp4"),
        stepsduration: '16 reps',
      }, 
       { text: "Start in the regular push up position, but with hands elevated on a bench or step, and do 10 incline push ups", 
        video: require("../assets/videos/InclinePushUps2.mp4") ,
        stepsduration: '10 reps',
      },
      {
        text: "Start in the regular push up position, but with knees on the ground, and do 10 knee push ups",
        video: require("../assets/videos/KneePushUps.mp4"),
        stepsduration: '10 reps',
      },
      {
        text: "Lay prone on the ground with arms supporting your body.Keep your body straight while raising and lowering you body with your arms, and do 10 push ups",
        video: require("../assets/videos/PushUps.mp4"),
        stepsduration: '10 reps',
      },
       {
        text: "Start in the regular push up position but with your hands wider than shoulder-width apart, and do 10 wide arm push ups",
        video: require("../assets/videos/WideArmPushUps.mp4"),
        stepsduration: '10 reps',
      }, 
      {
        text: "Lie down on your stomach and bend your elbows to lift your chest off the ground, and do 20 Second cobra stretches",
        video: require("../assets/videos/CobraStretch.mp4"),
        stepsduration: '20 sec',
      }, 
      {
        text: "Find a doorway or a wall, place your hands on the frame, and lean forward to stretch your chest, and do 20 Second chest stretches",
        video: require("../assets/videos/ChestStretch.mp4"),
        stepsduration: '20 sec',
      },
    ],
  },
  // {
  //   id: "3",
  //   title: "🚶 Walking Guide",
  //   duration: "10 mins",
  //   previewImage: require("../assets//trainings/WalkingGuide.jpeg"),
  //   description: "Daily walking routine to improve stamina.",
  //   steps: [
  //     {
  //       text: "2 min warm-up walk",
  //       video: require("../assets/videos/Planks.mp4"),
  //     },
  //     {
  //       text: "5 min brisk walk",
  //       video: require("../assets/videos/Planks.mp4"),
  //     },
  //     {
  //       text: "3 min cool down",
  //       video: require("../assets/videos/Planks.mp4"),
  //     },
  //   ],
  // },
];

export default function TrainingScreen() {
  const navigation = useNavigation();

  const handleStart = (module) => {
    navigation.navigate("TrainingDetail", {
      title: module.title,
      steps: module.steps,
      duration: module.duration,
      stepsduration: module.stepsduration,

    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Workout Modules</Text>
      <FlatList
        data={trainingModules}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ✅ Use Video instead of Image */}
            <Image source={item.previewImage} style={styles.image} />
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
  container: { flex: 1, backgroundColor: "#f0f8ff", padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0e4d92",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0e4d92",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0e4d92",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
