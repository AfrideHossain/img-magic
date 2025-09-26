"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function RegistrationPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  // router hook
  const router = useRouter();

  // async function for handling form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check if password and confirm password are same
    if (password !== confirmPassword) {
      alert("Passwords not matched");
      return;
    }

    // api call
    try {
      const res = await fetch("/api/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return <div>RegistrationPage</div>;
}
