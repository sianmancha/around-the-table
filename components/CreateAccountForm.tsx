'use client'

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup'

interface Values {
    name: string
    email: string
    password: string
}

interface Props {
    onClose: () => void
}

const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required'),
    email: Yup.string().email('Invalid Email').required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 Characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm your password.') 
})

export default function CreateAccountForm({onClose}: Props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const router = useRouter();

    const handleCreateAccount = async (values: Values) => {

        if(!name || !email || !password) {
            setError("All fields are required")
            return;
        }

        try {

            const resUserExists = await fetch('api/userExists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ email: values.email })
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("User already exists.")
                return;
            }

            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({
                    name: values.name, 
                    email: values.email, 
                    password: values.password,
                })
            });

            if (res.ok) {
                router.push("/")
            } else {
                console.log("User registration failed.")
            }
        } catch (error) {
            console.log("Error during registration: ", error)
        }
    }

    return (
        // <div className="grid place-items-center h-screen">
        //     <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        //         <h1 className="text-xl font-bold my-4">
        //             Register
        //         </h1>
        //         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        //             <input onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" />
        //             <input onChange={e => setEmail(e.target.value)} type="text" placeholder="Email" />
        //             <input onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        //             <button className="bg-green-600 text-white font-bld cursor-pointer px-6 py-2">
        //                 Register
        //             </button>
        //             {error && (
        //                 <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
        //                     {error}
        //                 </div>
        //             )}
        //             <Link className="text-sm mt-3 text-right" href={'/'}>
        //                 Already have an account? <span className="underline">Login</span>
        //             </Link>
        //         </form>
        //     </div>
        // </div>
        <Formik
                initialValues={{name: '', email: '', password: '', confirmPassword: ''}}
                validationSchema={SignUpSchema}
                onSubmit={handleCreateAccount}
            >
                {({values, touched, errors, handleChange, handleBlur, handleSubmit, isValid, dirty}) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3 max-w-96 mx-auto">
                            <Field
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                placeholder='Name'
                            />
                        {errors.name && touched.name ? (
                            <div className="text-[#c32f27]">{errors.name}</div>
                        ) : null}
                            <Field
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                placeholder='Email'
                            />
                            {errors.email && touched.email ? (
                                <div className="text-[#c32f27]">{errors.email}</div>
                            ) : null}
                            <Field
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                placeholder='Password'
                            />
                            {errors.password && touched.password ? (
                                <div className="text-[#c32f27]">{errors.password}</div>
                            ) : null}
                            <Field
                                type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}
                                placeholder='Confirm Password'
                            />
                            {errors.confirmPassword && touched.confirmPassword ? (
                                <div className="text-[#c32f27]">{errors.confirmPassword}</div>
                            ) : null}
                            <div className="flex flex-wrap lg:justify-end lg:flex-row gap-3 mt-4 justify-center">
                                <button className="border-2 border-[#c32f27] rounded-full p-2 uppercase text-[#c32f27] font-semibold" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="bg-[#968E5A] disabled:bg-opacity-30 text-[#FAF9F6] disabled:text-[#968E5A]/30 font-semibold cursor-pointer px-6 py-2 rounded-full" disabled={!isValid || !dirty} type="submit">
                                    Create Account
                                </button>
                            </div>
                    </div>
                    </Form>
                )}
            </Formik>
    )
}