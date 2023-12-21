"use client";
import { googleSignin, emailLogin } from "@/functions/functions";
import { useState } from "react";
import Link from "next/link";
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

        return (
            <>
                <div className="w-full h-screen flex flex-col justify-center items-center gap-2">
                    <h1 className="text-xl font-bold">Login</h1>
                    <form onSubmit={(e) => emailLogin(e, email, password)} className="flex flex-col gap-2 ">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="border border-2 p-2" placeholder="email" />
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="border border-2 p-2" placeholder="password" />
                        <button className="px-4 py-2 bg-blue-500 text-slate-100" type="submit">Login</button>
                    </form>
                    <h1>OR</h1>
                    <button className="px-4 py-2 bg-blue-500 text-slate-100" onClick={() => googleSignin()}>Google Signin</button>
                </div>
            </>
        )
    }