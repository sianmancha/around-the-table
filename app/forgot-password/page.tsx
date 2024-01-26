'use client'

import { Formik, Form, Field  } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from 'yup';

interface Values {
    email: String
}

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Email is Required'),
}); 

export default function ForgotPassword() {
    const [resetError, setResetError] = useState('');
    
    const router = useRouter();

    const handleResetPassword = async (values: Values) => {
        try {
            const res = await fetch('api/requestResetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            });

            if(res.ok) {
                const { resetToken } = await res.json();
                router.push(`/reset-password?email=${values.email}&resetToken=${resetToken}`);

            } else {
                const data = await res.json();
                setResetError(data.message)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('An error occured when processing your request: ', error)
            }
        }
    }

    return (
        <div>
            <h1>Forgot Password?</h1>
            {resetError && (
                    <div className="text-[#C32F27] text-balance text-center mb-4 bg-[#c32f27]/10 p-2 rounded-lg">
                        {resetError}
                    </div>
                )}
            <Formik initialValues={{email: ''}} onSubmit={handleResetPassword} validationSchema={ForgotPasswordSchema}>
                {({values, touched, errors, handleChange, handleBlur, handleSubmit, isValid, dirty}) => (
                    <Form onSubmit={handleSubmit}>
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
                        <button className="bg-[#968E5A] disabled:bg-opacity-30 text-[#FAF9F6] disabled:text-[#968E5A]/30 font-semibold cursor-pointer px-6 py-2 rounded-full" disabled={!isValid || !dirty} type='submit'>
                            Reset Password
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}