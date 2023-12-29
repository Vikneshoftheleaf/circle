"use client";
import { googleSignin, emailLogin } from "@/functions/functions";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import BackBtn from "@/components/backBtn";
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return (
        <>
            <BackBtn/>
            <div className="m-10 flex flex-col pt-5 justify-center items-center h-full gap-4">
                <div className="lg:w-1/4 flex flex-col gap-4">
                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="text-4xl font-bold">Welcome Back to Circle!</h1>
                        <p className="text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, quasi.</p>
                    </div>
                    <form onSubmit={(e) => emailLogin(e, email, password)} className="flex flex-col gap-4 ">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="rounded-md border border-2 p-2" placeholder="Email" />
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="rounded-md border border-2 p-2" placeholder="Password" />
                        <button className="px-4 py-2 bg-red-500 text-slate-100 rounded-md" type="submit">Log In</button>
                    </form>

                    <div className="flex gap-2 text-center justify-center items-center text-sm">
                        <h1>Don't have an account?</h1><Link href={'/signup'} className="text-red-500">Sign Up</Link>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <hr className="h-[2px]  bg-zinc-200 w-full rounded-full" />
                        <h1>Or</h1>
                        <hr className="h-[2px] bg-zinc-200  w-full rounded-full" />
                    </div>

                    <button className="px-4 py-2 border-2 flex items-center justify-center gap-4 rounded-md" onClick={() => googleSignin()}>
                        <Icon icon="devicon:google" />
                        <h1>Continue with Google</h1>
                    </button>
                </div>

            </div>
        </>
    )
}