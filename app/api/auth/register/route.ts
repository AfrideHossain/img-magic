import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = request.json();

    // validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    //   connect to database
    await connectToDatabase();

    //   check if user is already existed
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    //   create user
    await User.create({
      email,
      password,
    });
    //   send response
    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
}
