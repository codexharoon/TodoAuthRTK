import USER from "@/app/models/user";
import { dbConnection } from "@/lib/dbConnection";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnection();

    const { email, password } = await req.json();

    const isUserExist = await USER.findOne({ email });
    if (isUserExist) {
      return Response.json(
        {
          success: false,
          message: "User already exist",
        },
        {
          status: 401,
        }
      );
    }

    const hashedPass = await bcryptjs.hash(password, 10);

    const user = new USER({
      email,
      password: hashedPass,
    });

    await user.save();

    return Response.json(
      {
        success: true,
        message: "User created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("error in signup: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error - Failed to Signup",
      },
      {
        status: 500,
      }
    );
  }
}
