import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const renderWaterButton = (amount, value, setValue, operation = "add") => {
  return (
    <TouchableOpacity
      style={{ alignItems: "center", padding: 5 }}
      onPress={() => {
        operation == "add"
          ? setValue(value + amount)
          : value - amount < 0
          ? setValue(0)
          : setValue(value - amount);
      }}
    >
      <View
        style={{
          backgroundColor: operation == "add" ? "#1ca3ec" : "red",
          width: 50,
          height: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="bottle-soda" size={24} color="white" />
      </View>
      <Text style={{ color: "#5a595b", fontWeight: "600" }}>{amount} mL</Text>
    </TouchableOpacity>
  );
};

const amounts = [250, 500, 1000, 1500];

export default function App() {
  const [fillingPercentage, setFillingPercentage] = useState(0);
  const [waterGoal, setWaterGoal] = useState(3000);
  const [waterDrank, setWaterDrank] = useState(0);

  useEffect(() => {
    // percentage = waterDrank * 100 / waterGoal
    let percentage = (waterDrank * 100) / waterGoal;
    let fillingP = (percentage * 300) / 100;
    setFillingPercentage(fillingP > 300 ? 300 : fillingP);
  }, [waterGoal, setFillingPercentage, waterDrank]);

  return (
    <SafeAreaView style={styles.container}>
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
        {/* Water You've Drank Label */}
        <View style={{ justifyContent: "center" }}>
          <Text style={[styles.grayText, { fontSize: 28 }]}>You've drank</Text>
          <Text style={[styles.blueText, { fontSize: 42 }]}>
            {waterDrank} mL
          </Text>
          <Text style={[styles.grayText, { fontSize: 28 }]}>of water.</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={{
              height: fillingPercentage,
              backgroundColor: "#5abcd8",
              borderRadius: 40,
            }}
          />
        </View>
      </View>

      {/* Add Water */}
      <View style={styles.waterButtonsContainer}>
        {amounts.map((amount) => {
          return renderWaterButton(amount, waterDrank, setWaterDrank);
        })}
      </View>

      {/* Remove Water */}
      <View style={styles.waterButtonsContainer}>
        {amounts.map((amount) => {
          return renderWaterButton(amount, waterDrank, setWaterDrank, "remove");
        })}
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
});
