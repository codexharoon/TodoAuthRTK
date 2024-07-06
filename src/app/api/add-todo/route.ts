import { dbConnection } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import USER from "@/app/models/user";
import { Todo } from "@/app/models/todo";

interface decodedTokenType {
  id: string;
}

export async function POST(req: NextRequest) {
  await dbConnection();

  try {
    const { title, isCompleted } = await req.json();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No Token Found - You are not authorized to perform this action",
        },
        { status: 401 }
      );
    }

    const decoded: decodedTokenType = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as decodedTokenType;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Token - You are not authorized to perform this action",
        },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    const user = await USER.findById({ _id: userId });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const todo = {
      title,
      isCompleted,
    };

    user.todos.push(todo as Todo);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Todo added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Internal Server Error - Failed to Add Todo", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error - Failed to add Todo" },
      { status: 500 }
    );
  }
}
