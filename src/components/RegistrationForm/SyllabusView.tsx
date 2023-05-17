import React from 'react'
import { motion } from 'framer-motion'
import Select, { MultiValue } from 'react-select'

import { useRegistrationForm } from '@/contexts/RegistrationFormContext'

type OptionType = { label: string; value: string };

export default function SyllabusView() {
    const { formData, handleSelectChange, setCurrentView } = useRegistrationForm();

    // Dummy courses
    const courseOptions = [
        { value: "Intro to Programming", label: "Intro to Programming" },
        { value: "Advanced React", label: "Advanced React" },
        { value: "Data Science with Python", label: "Data Science with Python" },
        { value: "Machine Learning Basics", label: "Machine Learning Basics" },
    ];

    const handleChange = (selectedOptions: MultiValue<OptionType> | null) => {
        handleSelectChange("courses", selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    return (
        <motion.div
            key={'syllabus'}
            initial={{ translateX: '1200px' }}
            animate={{ translateX: '0' }}
            exit={{ translateX: '-1200px' }}
            className="flex flex-col gap-4"
        >
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Courses</span>
                </label>
                <Select
                    isMulti
                    closeMenuOnSelect={false}
                    name="courses"
                    options={courseOptions}
                    className="w-full col-span-2"
                    value={courseOptions.filter(option => formData.courses.includes(option.value))}
                    onChange={handleChange}
                />
            </div>
        </motion.div>
    )
}
