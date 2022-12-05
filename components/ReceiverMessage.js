import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const ReceiverMessage = ({ message }) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
      }}
      className="px-5 py-3 my-2 bg-red-400 rounded-lg rounded-tl-none ml-14"
    >
      <Image
        className="absolute top-0 w-12 h-12 rounded-full -left-14"
        source={{ uri: message.photoURL }}
      />
      <Text className="text-white">{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;

const styles = StyleSheet.create({});
