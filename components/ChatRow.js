import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/GetMachedUserInfo";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserIfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Messages", { matchDetails })}
      style={styles.shadows}
      className="flex-row items-center px-5 py-3 mx-3 my-1 bg-white rounded-lg"
    >
      <Image
        className="w-16 h-16 mr-4 rounded-full"
        source={{ uri: matchedUserIfo?.photoURL }}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">
          {matchedUserIfo?.displayName}
        </Text>
        <Text className="text-sm text-gray-500">{lastMessage || "Say Hi"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  shadows: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.41,
    elevation: 2,
  },
});


