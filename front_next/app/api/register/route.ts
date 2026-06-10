// /api/register

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

  try {

    const {
      name,
      email,
      password,
      phone,
      address,
      businessName
    } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if(existingUser){

      return Response.json(
        {
          message: "Email déjà utilisé"
        },
        {
          status: 400
        }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        companyName: businessName,
        address,
        phone,
        role: "USER"
      },
    });

    return Response.json(user);

  } catch(error){

    console.log(error);

    return Response.json(
      {
        message: "Erreur serveur"
      },
      {
        status: 500
      }
    );
  }
}