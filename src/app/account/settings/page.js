'use client'
import { useAuthContext } from "@/context/authcontext"
import { Icon } from "@iconify/react"
import { logOut } from "@/functions/functions";
export default function Setting() {
    const {user} = useAuthContext();
    return (
        <div>
            <div className="flex justify-start gap-2 items-center p-2">
                <button onClick={() => history.back()}>
                    <Icon icon="ep:back" />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 p-2">
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:share" />Invite Friends</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="ph:user-bold" />Account</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:help-outline" />Help</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:info-outline" />About</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:privacy-tip-outline" />Privacy & Policy </h1>
                    <button onClick={() => logOut()} className="flex flex-row justify-center items-center rounded-sm  gap-2 px-4 py-2 bg-red-500 text-slate-50">Log Out<Icon icon="material-symbols:logout" /></button>

                </div>
            </div>
        </div>
    )
}