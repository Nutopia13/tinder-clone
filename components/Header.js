import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons, Entypo, Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const Header = ({ title, callEnabled }) => {
    const navigation = useNavigation();
  return (
    <View className="flex-row items-center justify-between p-2">
      <View className="flex flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text className="pl-2 text-2xl font-bold">{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity className='items-center mr-5'>
          <Entypo name="phone" size={34} color="#FF5864" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
