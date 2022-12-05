import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { Avatar, Button } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { AntDesign, FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import generateId from "../lib/GenerateId";

const DUMMY_DATA = [
  {
    firstName: "John",
    lastName: " Doe",
    age: 24,
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    photoURL: "https://randomuser.me/api/portraits/men/75.jpg",
    id: 1,
  },
  {
    firstName: "Jane",
    lastName: " Doe",
    age: 22,
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    photoURL: "https://randomuser.me/api/portraits/women/90.jpg",
    id: 2,
  },
  {
    firstName: "Jane",
    lastName: " Doe",
    age: 22,
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    photoURL: "https://randomuser.me/api/portraits/women/30.jpg",
    id: 3,
  },
  {
    firstName: "Jane",
    lastName: " Doe",
    age: 22,
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    photoURL: "https://randomuser.me/api/portraits/women/50.jpg",
    id: 4,
  },
  {
    firstName: "Vlad",
    lastName: " Doe",
    age: 24,
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    photoURL: "https://randomuser.me/api/portraits/men/40.jpg",
    id: 5,
  },
  {
    firstName: "Vlad",
    lastName: " Doe",
    age: 24,
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    photoURL: "https://randomuser.me/api/portraits/men/43.jpg",
    id: 6,
  },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
    return unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const passesUserId = passes.length > 0 ? passes : [user.uid];
      const swipesUserId = swipes.length > 0 ? swipes : [user.uid];

      unsubscribe = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passesUserId, ...swipesUserId])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    fetchCards();
    return unsubscribe;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();
    const userSwipedProfile = await getDoc(
      doc(db, "users", userSwiped.id, "swipes", user.uid)
    ).then((documentSnapshot) => {
      if (documentSnapshot.exists()) {
        setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
        setDoc(doc(db, "matches", generateId(user.id, userSwiped.id)), {
          users: {
            [user.id]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });

        navigation.navigate("Match", {
          loggedInProfile,
          userSwiped,
        });
      } else {
      }
    });
    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
  };

  return (
    <SafeAreaView className="flex-1" style={styles.container}>
      {/* Header */}
      <View style={styles.header} className="flex-row items-center justify-between mx-5 my-3">
        <TouchableOpacity>
          <Avatar
            rounded
            size={50}
            source={{ uri: user.photoURL }}
            onPress={logout}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={{
              width: 70,
              height: 70,
            }}
            source={require("../assets/tinder.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubble-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* End Header */}

      {/* Cards */}
      <View className="flex-1 -mt-6">
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          stackSize={5}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                className="relative bg-white h-3/4 rounded-xl "
                style={styles.card}
              >
                <Image
                  source={{ uri: card.photoURL }}
                  className="absolute top-0 w-full h-full rounded-xl"
                />
                <View
                  style={styles.cardShadow}
                  className="absolute bottom-0 flex-row items-center justify-between w-full h-20 px-5 py-2 bg-white rounded-b-xl"
                >
                  <View>
                    <Text className="text-xl font-bold">
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text className="text-2xl font-bold">{card.age}</Text>
                </View>
              </View>
            ) : (
              <View className="relative items-center justify-center flex-1 bg-red-500 h-2/4 rounded-xl">
                <Text className="pb-5 text-2xl font-bold text-white ">
                  No More Profiles
                </Text>
                <Image
                  resizeMode="contain"
                  className="w-20 h-20 "
                  source={require("../assets/cry.png")}
                  height={20}
                  width={20}
                />
              </View>
            )
          }
        />
      </View>
      <View style={styles.buttons} className="flex flex-row justify-evenly">
        <TouchableOpacity className="items-center justify-center w-16 h-16 bg-red-200 rounded-full">
          <Entypo
            name="cross"
            size={24}
            color="red"
            
            onPress={() => swipeRef.current.swipeLeft()}
          />
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-16 h-16 bg-green-200 rounded-full">
          <AntDesign
            name="heart"
            color="green"
            size={24}
            onPress={() => swipeRef.current.swipeRight()}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  buttons: {
    marginBottom: Platform.OS === "android" ? 40 : 0,
  }
});
