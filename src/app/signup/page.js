"use client";
import { googleSignin, emailSignup } from "@/functions/functions";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

        return (
            <>
                <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
                    <h1 className="text-xl font-bold">SignUp</h1>
                    <form onSubmit={(e) => emailSignup(e, email, password)} className="flex flex-col gap-2 ">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="border border-2 p-2" placeholder="email" />
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="border border-2 p-2" placeholder="password" />
                        <button className="px-4 py-2 bg-blue-500 text-slate-100" type="submit">Sign Up</button>
                    </form>
                    <h1>OR</h1>
                    <button className="px-4 py-2 bg-blue-500 text-slate-100" onClick={() => googleSignin()}>Google SignUp</button>
                </div>
            </>
        )
    }