import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { AddRemoveButton } from "./components/AddRemoveButton";

const amounts = [250, 500, 1000, 1500];

// Async Storage
const storeData = async (value, key = "@amount") => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

const getData = async (key, setValue) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      setValue(Number(value));
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

const renderConfetti = () => {
  return <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} fadeOut={true} />;
};

// Notifications

async function scheduleNotification() {
  await Notifications.requestPermissionsAsync().then((permission) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Water Reminder",
        subtitle: "Your body needs water!",
      },
      trigger: {
        repeats: true,
        seconds: 60,
      },
    });
  });
}

export default function App() {
  const [fillingPercentage, setFillingPercentage] = useState(0);
  const [waterGoal, setWaterGoal] = useState(3000);
  const [waterDrank, setWaterDrank] = useState(0);
  const [isGoalAchieved, setIsGoalAchieved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Progress Bar Animation
  const barHeight = useRef(new Animated.Value(0)).current;
  const progressPercent = barHeight.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", `100%`],
  });

  useEffect(() => {
    getData("@amount", setWaterDrank);
    getData("@goal", setWaterGoal);
  }, []);

  useEffect(() => {
    Animated.timing(barHeight, {
      duration: 1000,
      toValue: fillingPercentage / 3,
      useNativeDriver: false,
    }).start();
  }, [fillingPercentage]);

  // End of Progress Bar Animation

  useEffect(() => {
    storeData(waterGoal.toString(), "@goal");
  }, [waterGoal]);

  useEffect(() => {
    storeData(waterDrank.toString(), "@amount");
  }, [waterDrank]);

  useEffect(() => {
    // percentage = waterDrank * 100 / waterGoal
    let percentage = (waterDrank * 100) / waterGoal;
    let fillingP = (percentage * 300) / 100;
    setFillingPercentage(fillingP > 300 ? 300 : fillingP);
  }, [waterGoal, setFillingPercentage, waterDrank]);

  useEffect(() => {
    if (waterDrank >= waterGoal && isGoalAchieved === false) {
      setIsGoalAchieved(true);
    }
    if (waterDrank < waterGoal && isGoalAchieved === true) {
      setIsGoalAchieved(false);
    }

    if (showConfetti === false && isGoalAchieved === true) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [waterDrank, isGoalAchieved, waterGoal]);

  return (
    <SafeAreaView style={styles.container}>
      {showConfetti && renderConfetti()}
      {/* Water Goal */}
      <View style={styles.waterGoalContainer}>
        <Text style={[styles.blueText, { fontSize: 22 }]}>Your Goal</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.grayText, { fontSize: 26 }]}>
            {waterGoal} mL{" "}
          </Text>
          {/* Add Goal */}
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => setWaterGoal(waterGoal + 250)}
          >
            <Ionicons name="add-circle" size={26} color="#2389da" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => setWaterGoal(waterGoal - 250)}
          >
            <Ionicons name="remove-circle" size={26} color="#2389da" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ProgressView */}

      <View
        style={{
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-around",
        }}
      >
        {/* Water You've Drunk Label */}
        <View style={{ justifyContent: "center" }}>
          <Text style={[styles.grayText, { fontSize: 28 }]}>You've drunk</Text>
          <Text style={[styles.blueText, { fontSize: 42 }]}>
            {waterDrank} mL
          </Text>
          <Text style={[styles.grayText, { fontSize: 28 }]}>of water.</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={{
              height: progressPercent,
              backgroundColor: "#5abcd8",
              borderRadius: 40,
            }}
          />
        </View>
      </View>

      {/* Add Water */}
      <View style={styles.waterButtonsContainer}>
        {amounts.map((amount) => {
          return (
            <AddRemoveButton
              key={"add" + amount}
              amount={amount}
              value={waterDrank}
              setValue={setWaterDrank}
              operation="add"
            />
          );
        })}
      </View>

      {/* Remove Water */}
      <View style={styles.waterButtonsContainer}>
        {amounts.map((amount) => {
          return (
            <AddRemoveButton
              key={"remove" + amount}
              amount={amount}
              value={waterDrank}
              setValue={setWaterDrank}
              operation="remove"
            />
          );
        })}
      </View>
      <View
        style={{
          paddingVertical: 20,
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              backgroundColor: "#74ccf4",
            },
          ]}
          onPress={() => scheduleNotification()}
        >
          <Text style={styles.notificationText}>Schedule Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              backgroundColor: "red",
            },
          ]}
          onPress={() => Notifications.cancelAllScheduledNotificationsAsync()}
        >
          <Text style={styles.notificationText}>Cancel Notifications</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  progressBarContainer: {
    borderRadius: 40,
    borderWidth: 1,
    width: 40,
    height: 300,
    justifyContent: "flex-end",
  },
  waterButtonsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    width: "90%",
    justifyContent: "space-between",
  },
  waterGoalContainer: {
    padding: 50,
    alignItems: "center",
  },
  blueText: {
    color: "#1ca3ec",
    fontWeight: "600",
  },
  grayText: { color: "#323033", fontWeight: "600" },
  notificationButton: {
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    padding: 7,
  },
  notificationText: { color: "white", fontWeight: "500", fontSize: 16 },
});
