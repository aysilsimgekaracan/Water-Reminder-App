import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const AddRemoveButton = ({
  amount,
  value,
  setValue,
  operation = "add",
}) => {
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
