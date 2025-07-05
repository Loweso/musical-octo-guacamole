"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCred.user.getIdToken();
    alert("Registered! Token: " + token);
  };

  const login = async () => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken();
    alert("Logged in! Token: " + token);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <h1>Login or Register</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="border border-gray-300 px-4 py-2 rounded mb-2"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
        className="border border-gray-300 px-4 py-2 rounded mb-2"
      />
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        onClick={register}
      >
        Register
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}
