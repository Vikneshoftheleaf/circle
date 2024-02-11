'use client'
import BackBtn from "@/components/backBtn";
import LoginForm from "@/components/loginForm"
import { useAuthContext } from "@/context/authcontext";
import { useRouter } from "next/navigation";

export default function Login() {
  
  const{user}=useAuthContext()
  const router = useRouter()
  if(user != null)
  {
    router.push('/account/vids')

  }

    return (
        <>
            <BackBtn />
            <LoginForm/>
        </>
    )
}