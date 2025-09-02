"use server";

import { LoginValues } from "@/lib/validation";
import { cookies } from "next/headers";



export const login = async (values: LoginValues)=> {
  const res = await fetch(`${process.env.API_URL}/awn/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();

  if (!res.ok) {
    if (typeof response.message === "string") {
      return { error: response.message };
    }

    const err = response.message[0];
    return { error: err };
  }

  const { access_token, refresh_token } = response;

  // Set secure cookie
  const cookieStore = await cookies();
  cookieStore.set("access_token", access_token, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1, // 1 hour
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });

  return { success: "Login successful!" };
};