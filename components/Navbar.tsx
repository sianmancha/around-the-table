'use client'

import diningTable from '../app/dining-table.svg'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'


export default function NavBar() {
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-between bg-[#D4AC97] py-4 px-8">
            <Image alt='Around the Table' src={diningTable} width={60} height={60} />
            {session ? (
                <div>
                    <button onClick={() => signOut()}>Sign Out</button>
                </div>
            ) : (
                <div className='flex flex-grow items-center'>
                    <h1 className='text-4xl text-[#FAF9F6] ml-auto'>
                        Around the Table
                    </h1>
                    <div className='text-[#FAF9F6] ml-auto'>
                        Signed Out
                    </div>
                </div>
            )}
        </div>
    )
}