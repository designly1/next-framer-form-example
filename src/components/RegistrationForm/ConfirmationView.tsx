import React, { use } from 'react'
import { motion } from 'framer-motion'

import { useRegistrationForm } from '@/contexts/RegistrationFormContext'

export interface T_RegistrationForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courses: string[];
    ccNumber: string;
    ccExp: string;
    ccCvv: string;
}

export default function ConfirmationView() {
    const { formData, setCurrentView, resetForm } = useRegistrationForm();

    return (
        <motion.div
            key={'confirmation'}
            initial={{ scale: 0.5 }} // Start above the view
            animate={{ scale: 1 }} // Bounce in to the center
            exit={{ scale: 0 }} // Exit down
            transition={{ type: 'spring', stiffness: 200, damping: 10 }} // This gives the bounce effect
            className="flex flex-col gap-6 text-center"
        >
            <h1 className="text-2xl font-bold">Thank you!</h1>
            <p>Your registration has been confirmed. You will receive an email with your login details shortly.</p>
            <p>Just kidding, this is a fake form 🤣</p>
            <h2 className="text-xl font-bold">Your information:</h2>
            <table className="table w-full [&>tr>td]:whitespace-normal">
                <tr>
                    <td>First Name:</td>
                    <td>{formData.firstName}</td>
                </tr>
                <tr>
                    <td>Last Name:</td>
                    <td>{formData.lastName}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>{formData.email}</td>
                </tr>
                <tr>
                    <td>Phone:</td>
                    <td>{formData.phone}</td>
                </tr>
                <tr>
                    <td>Courses:</td>
                    <td>{formData.courses.join(', ')}</td>
                </tr>
                <tr>
                    <td>Credit Card Number:</td>
                    <td>{formData.ccNumber}</td>
                </tr>
                <tr>
                    <td>Credit Card Expiration:</td>
                    <td>{formData.ccExp}</td>
                </tr>
                <tr>
                    <td>Credit Card CVV:</td>
                    <td>{formData.ccCvv}</td>
                </tr>
            </table>
            <button
                className="btn btn-primary"
                onClick={resetForm}
            >Again!</button>
        </motion.div>
    )
}
