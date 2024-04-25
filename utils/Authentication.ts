import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../services/FirebaseConfig";
import { ref, set } from "firebase/database";

// Sign up function for email and password
export const SignUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential;
};

// Adding authenticated user to users collection n more
export const addUser = async (
  userId: string,
  name: string | null,
  email: string | null
) => {
  try {
    await set(ref(db, "users/" + userId), {
      name,
      email,
    });
  } catch (error) {
    console.log("failed to add user", error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const LogIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
};

export const LogOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("an error occured", error);
  }
};

export const forgotPassword = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("email sent");
    })
    .catch((error: Error) => {
      console.log("an error occured", error);
    });
};

export const sendVerificationEmail = () => {
  const user = auth.currentUser;

  if (user !== null) {
    sendEmailVerification(user)
      .then(() => {
        console.log("email sent");
      })
      .catch((error) => {
        console.log("an error occured trying", error);
      });
  }
};
