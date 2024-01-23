'use client'

import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function UserInfo() {

    const { data: session } = useSession()

    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col gap-2 my-6 shadow-lg p-8 bg-zinc-300/10">
               <div>
                Name: <span className="font-bold">{session?.user?.name}</span>
               </div>
               <div>
                Email: <span className="font-bold">{session?.user?.email}</span>
               </div>
               <button className="bg-red-500 text-white font-bold px-6 py-2 mt-3" onClick={() => signOut()}>
                Log Out
               </button>
            </div>
        </div>
    )
};