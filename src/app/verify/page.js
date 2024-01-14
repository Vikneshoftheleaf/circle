'use client';
import { db,auth } from "@/firebase";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "@/context/authcontext";
import { logOut } from "@/functions/functions";
import { useRouter } from "next/navigation";
useRouter
export default function VerifyAccount()
{
    const router = useRouter()
    const [emailSented, setEmailSented] = useState(false)
    const [loading, setloading] = useState(true);
    const {user} = useAuthContext()

    useEffect(()=>{

        if(user!=null)
        {
            console.log(user)
           if(user.emailVerified == true)
           {
            console.log(user)
               router.push('/account/vids')
           }
   
            setloading(false)
        }
        
    })

    function sendVerificationEmail()
    {
        if (user) {
            sendEmailVerification(user)
              .then(() => {
                console.log('Verification email sent!');
                setEmailSented(true)
              })
              .catch((error) => {
                console.error('Error sending verification email:', error);
              });
          }
    }


 if(!loading)
    return(
        <div className="flex h-screen w-full justify-center ">
            
            <div className="p-4 rounded-md text-center flex flex-col gap-2 pt-20">
                <h1 className="font-bold text-2xl">Verify your Account!</h1>
                <p className="text-gray-500">Check Your Email Inbox</p>
                {
                    !emailSented
                    ?<button className="w-full py-2 font-medium bg-red-500 rounded-md text-slate-100" onClick={()=> sendVerificationEmail()}>Verify</button>

                    :<button className="w-full py-2 font-medium bg-red-50 rounded-md text-slate-900">Check your Inbox</button>

                }
                <button className="w-full py-2 font-medium border-2 rounded-md" onClick={()=> logOut()}>Sign Out</button>
                <button className="w-full py-2 font-medium border-2 rounded-md" onClick={()=> console.log(auth.currentUser)}>print</button>

            </div>
            <div>
            </div>
        </div>
    )
}