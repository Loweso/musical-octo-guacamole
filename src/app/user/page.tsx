"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface FirebaseUserData {
  uid: string;
  email: string;
  name: string | null;
}

export default function UserPage() {
  const [userData, setUserData] = useState<FirebaseUserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user logged in");
        return;
      }

      const token = await user.getIdToken();
      console.log("Token:", token);

      const res = await fetch("http://localhost:3000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("User data:", data);
      setUserData(data);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div>
      <h1>User Info</h1>
      {userData ? <pre>{JSON.stringify(userData, null, 2)}</pre> : "Loading..."}
    </div>
  );
}
