import React, { useRef } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const AddRemoveButton = ({
  amount,
  value,
  setValue,
  operation = "add",
}) => {
  // Shake Animation
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      style={{ alignItems: "center", padding: 5 }}
      onPress={() => {
        operation == "add"
          ? setValue(value + amount)
          : value - amount < 0
          ? setValue(0)
          : setValue(value - amount);
        startShake();
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
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          <MaterialCommunityIcons name="bottle-soda" size={24} color="white" />
        </Animated.View>
      </View>
      <Text style={{ color: "#5a595b", fontWeight: "600" }}>{amount} mL</Text>
    </TouchableOpacity>
  );
};
