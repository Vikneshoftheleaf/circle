'use client';
import { db,auth } from "@/firebase";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "@/context/authcontext";
export default function VerifyAccount()
{
   
    const [emailSented, setEmailSented] = useState(false)
    const [loading, setloading] = useState(true)
    const [user, setUser] = useState(null)
    useEffect(()=>{

        if(auth!=null)
        {
           setUser(auth.currentUser)
            setloading(false)
        }
        
    },[])

    function sendVerificationEmail()
    {
        if (user) {
            sendEmailVerification(user, {
              url: process.env.NEXT_PUBLIC_URL, // Replace with your app's URL
              handleCodeInApp: true,
            })
              .then(() => {
                console.log('Verification email sent!');
              })
              .catch((error) => {
                console.error('Error sending verification email:', error);
              });
          }
    }
 if(!loading)
    return(
        <div className="flex h-screen w-full items-center justify-center bg-red-50">
            <div className="p-4 rounded-md text-center flex flex-col gap-2">
                <h1 className="font-bold text-2xl">Verify your Account!</h1>
                <p className="text-gray-500">Check Your Email Inbox</p>
                {
                    !emailSented
                    ?<button className="w-full py-2 font-medium bg-red-500 rounded-md text-slate-100" onClick={()=> sendVerificationEmail()}>Verify</button>

                    :<button className="w-full py-2 font-medium bg-red-50 rounded-md text-slate-900">Check your Inbox</button>

                }

            </div>
            <div>
            </div>
        </div>
    )
}