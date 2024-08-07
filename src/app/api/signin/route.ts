import { NextRequest, NextResponse } from "next/server";
import USER from "@/app/models/user";
import { dbConnection } from "@/lib/dbConnection";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  dbConnection();
  try {
    const { email, password } = await req.json();

    const isUserExist = await USER.findOne({ email });
    if (!isUserExist) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      isUserExist.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credientials",
        },
        {
          status: 401,
        }
      );
    }

    const token = jwt.sign(
      { id: isUserExist._id },
      process.env.JWT_SECRET!,
      {}
    );

    // removing the password property from the user object and send as response
    isUserExist.password = "";

    const res = NextResponse.json(
      {
        success: true,
        message: "Signin successfully",
        user: isUserExist,
      },
      {
        status: 200,
      }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
    });

    return res;
  } catch (error) {
    console.log("Internal Server Error - Failed to Signin", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error - Failed to Signin",
      },
      {
        status: 500,
      }
    );
  }
}
