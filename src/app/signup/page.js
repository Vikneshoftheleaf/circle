"use client";

import { useAuthContext } from "@/context/authcontext"
import { useRouter } from "next/navigation"
import SignupForm from "@/components/SignupForm";
import BackBtn from "@/components/backBtn";

export default function Signup() {

  const { user } = useAuthContext()
    const router = useRouter()

  
    if(user != null)
    {
      router.push('/account/vids')
    }



    
    return (
        <>
            <BackBtn />
            <SignupForm/>
            
        </>
    )
}