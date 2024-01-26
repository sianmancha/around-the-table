'use client'

import diningTable from '../app/dining-table.svg'
import Image from 'next/image'
import { useSession } from 'next-auth/react'


export default function NavBar() {
    const { data: session } = useSession();
    return (
        <div className=" flex items-center justify-between bg-[#D4AC97] p-4">
            <Image alt='Around the Table' src={diningTable} width={60} height={60} />
            {session ? (
                <div>Signed In</div>
            ) : (
                <div>Signed Out</div>
            )}
        </div>
    )
}