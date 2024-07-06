import { dbConnection } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import USER from "@/app/models/user";

interface decodedTokenType {
  id: string;
}

export async function GET(req: NextRequest) {
  await dbConnection();

  try {
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

    const user = await USER.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Todos fetched successfully",
        data: user.todos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Internal Server Error - Get Todos ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error - Get Todos",
      },
      { status: 500 }
    );
  }
}
