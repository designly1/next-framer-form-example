import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import InputMask from 'react-input-mask'

import { useRegistrationForm } from '@/contexts/RegistrationFormContext'

export default function PaymentView() {
    const { formData, handleFormChange, formErrors } = useRegistrationForm();

    return (
        <motion.div
            key={'payment'}
            initial={{ translateX: '1200px' }}
            animate={{ translateX: '0' }}
            exit={{ translateX: '-1200px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="md:col-span-2 text-red-600 text-sm text-center">
                Warning this is a fake form. Do not enter real payment information.
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Card Number</span>
                </label>
                <InputMask
                    mask="9999 9999 9999 9999"
                    value={formData.ccNumber}
                    onChange={handleFormChange}
                    name="ccNumber"
                    className="input input-bordered"
                >
                </InputMask>
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.ccNumber}
                    </span>
                </label>
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Expiry Date</span>
                </label>
                <InputMask
                    mask="99/99"
                    value={formData.ccExp}
                    onChange={handleFormChange}
                    name="ccExp"
                    className="input input-bordered"
                >
                </InputMask>
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.ccExp}
                    </span>
                </label>
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">CVV</span>
                </label>
                <InputMask
                    mask="999"
                    value={formData.ccCvv}
                    onChange={handleFormChange}
                    name="ccCvv"
                    className="input input-bordered"
                >
                </InputMask>
                <label className="label">
                    <span className="label-text-alt text-red-500">
                        {formErrors.ccCvv}
                    </span>
                </label>
            </div>
        </motion.div>
    )
}
