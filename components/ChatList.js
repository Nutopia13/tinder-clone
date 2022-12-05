import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { db } from "../lib/firebase";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "matches"),
        where("usersMatched", "array-contains", user.uid)
      ),
      (snapshot) =>
        setMatches(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
    return unsubscribe;
  }, [user]);

  return matches.length > 0 ? (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View className="p-5">
      <Text className="text-2xl text-center">No matches yet</Text>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
