'use client';
import { db, auth } from "@/firebase";
import { useEffect, useState } from "react";
import { onIdTokenChanged, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { useAuthContext } from "@/context/authcontext";
import { logOut } from "@/functions/functions";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
export default function VerifyAccount() {
    const router = useRouter()
    const [emailSented, setEmailSented] = useState(false)
    const [loading, setloading] = useState(true);
    const { profile } = useAuthContext();
    const [inputCode, setInputCode] = useState(null);
    const [codeError, setCodeError] = useState(null)

    useEffect(() => {
        if (profile != null) {
            setloading(false)
        }
    }, [profile])

    function sendVerificationEmail() {
        if (user != null) {
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    console.log('Verification email sent!');
                    setEmailSented(true)
                })
                .catch((error) => {
                    console.error('Error sending verification email:', error);
                });
        }
    }

    function resendCode() {
        const newcode = generateRandomString(6);
        updateDoc(doc(db,'user',profile.uid),{
            emailVerifyCode :newcode
        }).then(()=>sendCode('verify',newcode, profile.email))

        setEmailSented(true)
    }

    function validateCode() {
        if (profile.emailVerifyCode == inputCode) {

            updateDoc(doc(db,'user',profile.uid),{
                emailVerifyCode :null,
                isEmailVerified: true
            }).then(()=>sendCode('welcome',null, profile.email, profile.displayName))

        }
        else
        {
            setCodeError('Invalid or Wrong Code')
        }

    }

    async function sendCode(type, code, email, name) {

        const res = await fetch('/api/mail',{
          method:'POST',
          headers:{
            'content-type':'application/json'
          },
          body: JSON.stringify({
            type,
            code,
            email,
            name
          })
        })

        const data = await res.json()
        console.log(data)
      }

      function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
      
        return randomString;
      }

      useEffect(()=>{
        if(profile.isEmailVerified)
        {
            router.push('account/create')
        }
      },[profile])
    if (!loading)
        return (
            <div className="flex h-screen w-full justify-center ">

                <div className="p-4 rounded-md text-center flex flex-col gap-2 pt-20">
                    <h1 className="font-bold text-2xl">Verify your Account!</h1>
                    <p className="text-gray-500">Check Your Email Inbox</p>
                    <input type="text" name="" id="" className="px-4 py-2 rounded-md focus:outline-none" required placeholder="Enter the Code" onChange={(e) => setInputCode(e.target.value)} />
                    <p className="text-sm text-red-500">{(codeError != null)
                        ? codeError
                        : null
                    }</p>
                    <button className="py-2 font-medium text-slate-100 rounded-md bg-red-500" onClick={() => validateCode()}>Verify</button>
                    {(emailSented)
                    ?<button className="py-2 font-medium text-sm rounded-md border  ">check Your Inbox!</button>
                    :<button className="py-2 font-medium rounded-md border " onClick={()=> resendCode()}>Resend Code</button>

                }
                </div>
                <div>
                </div>
            </div>
        )
}