import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "@rneui/themed";

const LoginScreen = ({ navigation }) => {
  const { request, promptAsync, loading } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View className="flex-1">
      <ImageBackground
        className="flex-1"
        resizeMode="cover"
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          style={{ marginHorizontal: "25%" }}
          className="absolute bottom-44 w-52"
        >
          <Button
            buttonStyle={{
              borderRadius: 15,
              backgroundColor: "white",
              padding: 15,
            }}
            titleStyle={{
              color: "black",
              fontSize: 15,
              fontWeight: "bold",
            }}
            title="Sign in & Get Swiping"
            disabled={!request}
            onPress={() => {
              promptAsync(); // this will open the browser
            }}
          ></Button>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
