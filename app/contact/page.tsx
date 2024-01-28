'use client'

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

interface Values {
    name: String,
    email: String,
    subject: String,
    message: String
}

const subjects = ['Help', 'Bug Report', 'Feedback/Suggestions', 'Other'];

const ContactFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    subject: Yup.string().required('Please select a topic'),
    message: Yup.string().required('Message is required'),
  });

export default function Contact() {
    const [submissionError, setSubmissionError] = useState('')

    async function handleSubmitContact(values: Values) {
        try {
            const res = await fetch('api/contact', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    subject: values.subject,
                    message: values.message,
                })
            });

            if(res.ok){
                toast.custom(
                    <div className="flex items-center gap-4 bg-[#968E5A] text-[#FAF9F6] text-center py-4 px-6 rounded-md">
                       Form submitted successfully! 
                    </div>
                )
            } else {
                const data = await res.json();
                setSubmissionError(data.message)
            }
        } catch (error) {
            setSubmissionError('An error occurred while submitting the form.')
        }
    }
    return (
        <div className='grid place-items-center h-screen'>
            <div className='shadow-lg p-5 rounded-lg border-t-4 border-[#D4AC97] bg-[#F9F6EE] w-9/12 lg:max-w-[450px] mx-4'>
                {submissionError && (
                    <div className="text-[#C32F27] text-balance text-center mb-4 bg-[#c32f27]/10 p-2 rounded-lg">
                        {submissionError}
                    </div>
                )}
                <h1 className="text-xl font-bold my-4 text-[#772604]">
                   Contact Us
                </h1>
                <Formik initialValues={{name: '', email: '', subject: '', message: ''}} onSubmit={handleSubmitContact} validationSchema={ContactFormSchema}>
                {({values, touched, errors, handleChange, handleBlur, handleSubmit, isValid, dirty}) => (
                    <Form className='flex flex-col gap-3' onSubmit={handleSubmit}>
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
                            as='select'
                            name='subject'
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            <option className='text-[#654236]/80' value=''>Select a topic</option>
                            {subjects.map((topic) => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </Field>
                        {errors.subject && touched.subject ? (
                            <div className="text-[#c32f27]">{errors.subject}</div>
                        ) : null}
                        <Field
                            as="textarea"
                            name="message"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                            placeholder='Message' 
                        />
                        {errors.message && touched.message ? (
                            <div className="text-[#c32f27]">{errors.message}</div>
                        ) : null}
                        <button className="bg-[#968E5A] disabled:bg-opacity-30 text-[#FAF9F6] disabled:text-[#968E5A]/30 font-semibold cursor-pointer px-6 py-2 rounded-full" disabled={!isValid || !dirty} type="submit">
                            Submit Form
                        </button>
                    </Form>
                )}
                </Formik>
            </div>
        </div>
    )
}