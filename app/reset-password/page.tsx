'use client'

import { Form, Formik, Field } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from 'react-hot-toast'
import * as Yup from 'yup';

interface Values {
    newPassword: string,
    confirmPassword: string,
}

const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().min(6, 'Minimum 6 Characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match').required('Please confirm your password.') 
})

export default function ResetPassword() {
    const [resetError, setResetError] = useState('');
    const router = useRouter();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm resetError={resetError} setResetError={setResetError} router={router} />
        </Suspense>
    );
}

function ResetPasswordForm({ resetError, setResetError, router }: { resetError: string, setResetError: (error: string) => void, router: any }) {
    const params = useSearchParams();
    const email = params?.get('email')
    const resetToken = params?.get('resetToken')

    async function handlePasswordReset(values: Values) {
        try {
            const res = await fetch('api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    resetToken,
                    newPassword: values.newPassword
                }),
            });

            if(res.ok) {
                await new Promise((resolve) => {
                    router.push('/');
                    resolve(undefined);
                });
                toast.custom(
                    <div className="flex items-center gap-4 bg-[#968E5A] text-[#FAF9F6] text-center py-4 px-6 rounded-md">
                        Password successfully updated! Please sign in. 
                    </div>
                )
            } else {
                const data = await res.json();
                setResetError(data.message)
            }
        } catch (error) {
            console.error("An error occurred while processing the request:", error);
            setResetError("An error occurred while resetting your password");
        }
    }

    return (
        <div>
            <h1>Reset Your Password</h1>
            {resetError && (
                    <div className="text-[#C32F27] text-balance text-center mb-4 bg-[#c32f27]/10 p-2 rounded-lg">
                        {resetError}
                    </div>
                )}
            <Formik initialValues={{ newPassword: '', confirmPassword: '' }} onSubmit={handlePasswordReset} validationSchema={ResetPasswordSchema}>
                {({values, touched, errors, handleChange, handleBlur, handleSubmit, isValid, dirty}) => (
                    <Form onSubmit={handleSubmit}>
                        <Field
                            type='password'
                            name='newPassword'
                            placeholder='New Password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.newPassword} 
                        />
                        {errors.newPassword && touched.newPassword ? (
                            <div className="text-[#c32f27]">{errors.newPassword}</div>
                        ) : null}
                        <Field
                            type='password'
                            name='confirmPassword'
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword} 
                        />
                        {errors.confirmPassword && touched.confirmPassword ? (
                            <div className="text-[#c32f27]">{errors.confirmPassword}</div>
                        ) : null}
                        <button className="bg-[#968E5A] disabled:bg-opacity-30 text-[#FAF9F6] disabled:text-[#968E5A]/30 font-semibold cursor-pointer px-6 py-2 rounded-full" disabled={!isValid || !dirty} type='submit'>
                            Reset Password
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
