"use server"

import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
export async function POST(request)
{
  try {

    const {type, code, email, name} = await request.json();
    const transporter = createTransport({
      service:'gmail',
      auth:{
        user: process.env.NEXT_PUBLIC_EMAIL_ID,
        pass:process.env.NEXT_PUBLIC_EMAIL_PASSWORD
      }
    })
  
    const verifyMailBycCode = {
      from:{
        name: 'Circle',
        address: process.env.NEXT_PUBLIC_EMAIL_ID
      },
      to: email,
      subject: "Verify Your Circle Account",
      html: `<p>Your Code is ${code} </p>`
    }

    const welcomeEmail = {
      from:{
        name: 'Circle',
        address: process.env.NEXT_PUBLIC_EMAIL_ID
      },
      to: email,
      subject: "Welcome to Circle!",
      html: `<p>Hello ${name} !, let's start your your Social networking journey from here. </p>`
    }

    if(type == 'verify')
    {
      await transporter.sendMail(verifyMailBycCode)
        
        return NextResponse.json({message: 'Verification Code Have Been Sented'}, {status: 200})

    }

    if(type == 'welcome')
    {
      await transporter.sendMail(welcomeEmail)
        
        return NextResponse.json({message: 'Welcome Email Have Been Sented'}, {status: 200})

    }
  
  
  
    
  } catch (error) {
    return NextResponse.json({message: error}, {status: 200})

  }
}