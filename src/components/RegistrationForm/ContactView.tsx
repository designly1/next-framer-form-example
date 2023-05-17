import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputMask from 'react-input-mask'

import { useRegistrationForm } from '@/contexts/RegistrationFormContext'

export default function ContactView() {
    const { formData, handleFormChange, formErrors } = useRegistrationForm();

    return (
        <motion.div
            key={'contact'}
            initial={{ translateX: '1200px' }}
            animate={{ translateX: '0' }}
            exit={{ translateX: '-1200px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">First Name</span>
                </label>
                <input
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    className="input input-bordered w-full max-w-xs"
                    value={formData.firstName}
                    onChange={handleFormChange}
                />
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.firstName}
                    </span>
                </label>
            </div>
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Last Name</span>
                </label>
                <input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    className="input input-bordered w-full max-w-xs"
                    value={formData.lastName}
                    onChange={handleFormChange}
                />
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.lastName}
                    </span>
                </label>
            </div>
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Email Address</span>
                </label>
                <input
                    name="email"
                    type="email"
                    placeholder="jane.doe@example.com"
                    className="input input-bordered w-full max-w-xs"
                    value={formData.email}
                    onChange={handleFormChange}
                />
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.email}
                    </span>
                </label>
            </div>
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Phone Number</span>
                </label>
                <InputMask
                    mask="(999) 999-9999"
                    name="phone"
                    type="text"
                    placeholder="Doe"
                    className="input input-bordered w-full max-w-xs"
                    value={formData.phone}
                    onChange={handleFormChange}
                />
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.phone}
                    </span>
                </label>
            </div>
        </motion.div>
    )
}
