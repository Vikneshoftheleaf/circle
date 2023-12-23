"use client"
import { Icon } from "@iconify/react";
import { useAuthContext } from "@/context/authcontext";
import Link from "next/link";
import Image from "next/image";
import BackBtn from "@/components/backBtn";
export default function Profile() {
    const { user } = useAuthContext();
    return (
        <>
            <div className="flex flex-col gap-4">

                <div className="flex justify-between items-center p-2">
                    <BackBtn />
                    <h1>{(user.displayName) ? user.displayName : user.email}</h1>
                    <Link className="text-2xl" href={'/account/settings'}><Icon icon="zondicons:dots-horizontal-triple" /></Link>
                </div>

                <div className="flex flex-col gap-4 ">

                    <div className="flex justify-center items-center ">
                        {user.photoURL ? <Image className="rounded-full" src={user.photoURL} height={100} width={100} alt="User"></Image>
                            : 'U'}
                    </div>

                    <div className="text-center">
                        <h1>@username</h1>
                    </div>

                    <div className="flex justify-center items-center gap-6">
                        <div className="flex flex-col justify-center items-center text-center">
                            <h1>100K</h1>
                            <h1>Following</h1>
                        </div>
                        <div className="flex flex-col justify-center items-center text-center">
                            <h1>1M</h1>
                            <h1>Followers</h1>
                        </div>
                        <div className="flex flex-col justify-center items-center text-center">
                            <h1>899K</h1>
                            <h1>Likes</h1>
                        </div>
                    </div>

                    <div className="flex justify-center items-center">
                        <button className="bg-red-500 text-slate-50 font-semibold px-6 py-2 rounded-sm">Follow</button>
                    </div>

                    <div className="text-center text-sm p-2">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi nobis incidunt obcaecati fugiat, et blanditiis!</p>
                    </div>


                </div>


            </div>
        </>
    )
}