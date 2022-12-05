import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "@rneui/base";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const ModalScreen = ({navigation}) => {
  const { user } = useAuth();
  const [age, setAge] = useState(null);
  const [job, setJob] = useState(null);
  const [image, setImage] = useState(null);

  const incompleteForm = !age || !job;

  const updateProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      age: age,
      job: job,
      photoURL: image,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View className="items-center flex-1 pt-1">
    
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Image
              resizeMode="contain"
              className="w-full h-20"
              source={{ uri: "https://links.papareact.com/2pf" }}
            />
            <Text className="p-2 text-xl text-gray-500">
              Welcome {user.displayName}
            </Text>
            <Text className="p-4 font-bold text-left text-red-400">
              Step 1: The Profile Pic
            </Text>
            <TextInput
              className="p-2 border-2 border-gray-300 rounded-lg"
              placeholder="Enter a Profile Pic Url"
              value={image}
              onChangeText={(text) => setImage(text)}
            />
            <Text className="p-4 font-bold text-left text-red-400">
              Step 2: Enter your Occupation
            </Text>
            <TextInput
              className="p-2 border-2 border-gray-300 rounded-lg"
              placeholder="Enter a Job"
              value={job}
              onChangeText={(text) => setJob(text)}
            />
            <Text className="p-4 font-bold text-center text-red-400">
              Step 3: Enter you Age
            </Text>
            <TextInput
              className="p-2 border-2 border-gray-300 rounded-lg"
              placeholder="Age"
              value={age}
              maxLength={2}
              keyboardType="numeric"
              onChangeText={(text) => setAge(text)}
            />
            <TouchableOpacity className="absolute bottom-20">
              <Button
                buttonStyle={{
                  width: 300,
                  height: 60,
                  backgroundColor: incompleteForm ? "gray" : "#f15454",
                }}
                titleStyle={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
                radius="md"
                size="lg"
                title="Update Profile"
                disabled={incompleteForm}
                onPress={updateProfile}
              />
            </TouchableOpacity>
          </>
        </TouchableWithoutFeedback>
      
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({});
