'use client'

import React, { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";

export default function CreateAccountModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registrationError, setRegistrationError] = useState('')

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
        setRegistrationError('')
    }

    function handleRegistrationError(error: string) {
        setRegistrationError(error)
    }
    
    return (
        <div>
            <button className="bg-[#A8591F] text-[#FAF9F6] font-semibold cursor-pointer px-6 py-2 rounded-full" onClick={openModal}>
                Create Account
            </button>
            {isModalOpen ? (
                <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div className="shadow-lg p-5 rounded-lg border-t-4 border-[#D4AC97] bg-[#F9F6EE] w-9/12 lg:max-w-[450px] mx-4">
                        <div className="flex items-start justify-between text-[#772604]">
                            <h1 className="text-xl font-bold my-4">Create An Account</h1>
                            <button className="text-xl font-semibold" onClick={closeModal}>X</button>
                        </div>
                        {registrationError && (
                            <div className="text-[#C32F27] text-balance text-center mb-4 bg-[#c32f27]/10 p-2 rounded-lg">
                                {registrationError} Please{' '}
                                <button className="underline font-semibold text-[#C32F27] cursor-pointer" onClick={closeModal}>
                                    sign in
                                </button>
                                {' '}
                                or try again with a different email.
                            </div>
                        )}
                        <CreateAccountForm onClose={closeModal} onRegistrationError={handleRegistrationError} />
                    </div>
                </div>
                ) : null
            }
        </div>
    )
}