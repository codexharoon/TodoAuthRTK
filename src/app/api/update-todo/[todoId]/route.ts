import { dbConnection } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import USER from "@/app/models/user";

interface decodedTokenType {
  id: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { todoId: string } }
) {
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

    // finding the todo in todos array of user and updating it
    const updateRes = await USER.updateOne(
      { _id: userId, "todos._id": params.todoId },
      {
        $set: {
          "todos.$[elem].title": title,
          "todos.$[elem].isCompleted": isCompleted,
        },
      },
      { arrayFilters: [{ "elem._id": params.todoId }] }
    );

    if (updateRes.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Todo not found or already updated",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Todo updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Internal Server Error - Update TODO", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error - Update TODO",
      },
      { status: 500 }
    );
  }
}
