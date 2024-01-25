'use client'

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup'
import CreateAccountModal from "./CreateAccountModal";

interface Values {
    email: string;
    password: string;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Email is Required'),
    password: Yup.string().required('Password is Required')
}); 

export default function LoginForm() {
    const [loginError, setLoginError] = useState('');
    
    const router = useRouter();

    async function handleLogin(values: Values) {
        try {
            const res = await signIn('credentials', {
               email: values.email, 
               password: values.password, 
               redirect: false 
            })
            
            if(res?.ok) {
                router.replace('dashboard')
            } else {
                setLoginError('Invalid email or password. Please try again or create a new account.')
            }


        } catch (error) {
                console.error('Error occurred during login:', error);
            }
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-[#D4AC97] bg-[#F9F6EE] w-9/12 lg:max-w-[450px] mx-4">
                {loginError && (
                    <div className="text-[#C32F27] text-balance text-center mb-4 bg-[#c32f27]/10 p-2 rounded-lg">
                        {loginError}
                    </div>
                )}
                <h1 className="text-xl font-bold my-4 text-[#772604]">
                    Login
                </h1>
                <Formik initialValues={{email: '', password: ''}} validationSchema={LoginSchema} onSubmit={handleLogin}>
                {({values, touched, errors, handleChange, handleBlur, handleSubmit, isValid, dirty}) => (
                    <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                        <Field
                            type='email'
                            name='email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            placeholder='Email'
                        />
                        {errors.email && touched.email ? (
                            <div className="text-[#c32f27]">{errors.email}</div>
                        ) : null}
                        <Field
                            type='password'
                            name='password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder='Password'
                        />
                        {errors.password && touched.password ? (
                            <div className="text-[#c32f27]">{errors.password}</div>
                        ) : null}
                        <button className="bg-[#968E5A] disabled:bg-opacity-30 text-[#FAF9F6] disabled:text-[#968E5A]/30 font-semibold cursor-pointer px-6 py-2 rounded-full" disabled={!isValid || !dirty} type='submit'>
                            Sign In
                        </button>
                    </Form>
                    )}
                </Formik>
                <div className="flex flex-col items-center gap-3 mt-4 text-[#772604]">
                    Don’t have an account?
                    <CreateAccountModal />
                </div>
            </div>
        </div>
    )
}