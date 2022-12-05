import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../lib/firebase";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({
  user: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  //Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
    });
    return unsubscribe;
  });

  //Google Sign In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "989442885943-l9s0ds8h797emovcqs992ctn52s3pbpu.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  //Sign Out
  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  //Optimization of the context
  const memoedValue = useMemo(
    () => ({ user, request, promptAsync, logout, loading, error }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={{user, request, promptAsync, logout, loading, error}}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
