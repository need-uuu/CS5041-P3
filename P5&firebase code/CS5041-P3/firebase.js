import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyDBjUEw_DQNMQsZJWfTtLL0PQJoH-xF0kk",
    authDomain: "sta-cs5041.firebaseapp.com",
    databaseURL: "https://sta-cs5041-p3.firebaseio.com",
    projectId: "sta-cs5041",
    storageBucket: "sta-cs5041.appspot.com",
    messagingSenderId: "639987847762",
    appId: "1:639987847762:web:1d86691716f6fb5443458b"
};

const firebaseToken = "37a4ef81-f24f-4292-9a74-37e84c9391cb";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const database = getDatabase(firebaseApp);

const functions = getFunctions(firebaseApp);
const getToken = httpsCallable(functions, "getToken");

// Function to login using token
// You can just use this file without modification (apart from the the token)

export const signInWithToken = async () => {
    const token = await getToken({ token: firebaseToken });
    if (token?.data?.result === "ok" && token?.data?.token) {
        await signInWithCustomToken(auth, token?.data?.token);
    } else {
        console.error(token?.data?.reason ?? "unknown error")
    }
}
