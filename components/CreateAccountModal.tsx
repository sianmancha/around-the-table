'use client'

import React, { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";

export default function CreateAccountModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
    }
    
    return (
        <div>
            <button className="bg-[#968E5A] text-[#FAF9F6] font-semibold cursor-pointer px-6 py-2 rounded-full" onClick={openModal}>
                Create Account
            </button>
            {isModalOpen ? (
                    <div className="grid place-items-center h-screen">
                        <div className="shadow-lg p-5 rounded-lg border-t-4 border-[#D4AC97] bg-[#F9F6EE] w-9/12 lg:max-w-[450px] mx-4">
                            <div className="flex items-start justify-between text-[#772604]">
                                <h1 className="text-xl font-bold my-4">
                                    Create An Account
                                </h1>
                                <button className="text-xl font-semibold" onClick={closeModal}>
                                    X
                                </button>
                            </div>
                            <CreateAccountForm onClose={closeModal} />
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}