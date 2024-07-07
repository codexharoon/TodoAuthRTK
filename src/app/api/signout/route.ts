import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json(
      {
        success: true,
        message: "logout successfully",
      },
      { status: 200 }
    );

    res.cookies.set("token", "", { maxAge: 0 });

    return res;
  } catch (error) {
    console.log("error to logout", error);
    return NextResponse.json(
      {
        success: false,
        message: "error to logout",
      },
      { status: 500 }
    );
  }
}
