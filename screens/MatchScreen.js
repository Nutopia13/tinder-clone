import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { Button } from "@rneui/themed";

const MatchScreen = ({ navigation }) => {
  const { params } = useRoute();

  const { loggedInProfile, userSwiped } = params;

  return (
    <View className="h-full pt-20 bg-red-500 opacity-80">
      <View className="items-center justify-center px-10 pt-20 ite">
        <Image 
        className='w-48 h-48'
        resizeMode="contain"
        height={50}
        width={50}
        source={require("../assets/love-birds.png")} />
      </View>
      <Text className="mt-10 text-2xl text-center text-white">
        You and {userSwiped.displayName} have matched!
      </Text>
      <View className="flex-row mx-auto mt-5 space-x-5 justify-evenly">
        <Image
          className="w-32 h-32 rounded-full w-21"
          source={{ uri: loggedInProfile.photoURL }}
        />
        <Image
          className="w-32 h-32 rounded-full"
          source={{ uri: userSwiped.photoURL }}
        />
      </View>
      <TouchableOpacity className="items-center mt-10">
        <Button
          buttonStyle={{
            borderRadius: 15,
            backgroundColor: "white",
            width: 200,
            height: 50,
            alignItems: "center",
          }}
          titleStyle={{ color: "black", fontWeight: "bold", fontSize: 20 }}
          title="Send a Message"
          onPress={() => {
            navigation.goBack();
            navigation.navigate("Chat");
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;

const styles = StyleSheet.create({});
