/**
 * We must use the 'use client' directive
 * for ensure that our code is sent
 * to the browser to be executed. All components
 * in the app router are server components
 * by default!
 */
'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Import our types
import { T_RegistrationForm, T_RegistrationFormContext, T_FormProviderProps, T_CurrentView, T_SyllabusEvent } from '@/components/RegistrationForm/RegistrationForm';

// Initialize our form data and errors
const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courses: [],
    ccNumber: "",
    ccExp: "",
    ccCvv: "",
};

const initialFormErrors = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courses: "",
    ccNumber: "",
    ccExp: "",
    ccCvv: "",
};

// List of available views
const views = ["contact", "syllabus", "payment", "loading", "confirmation"];

// Initialize our form context
const RegistrationFormContext = createContext<T_RegistrationFormContext | undefined>(undefined);


/** This is our form provider component. It will wrap our entire app,
 * and provide us with the form data and methods.
 */
export const RegistrationFormProvider: React.FC<T_FormProviderProps> = ({ children }) => {
    const [formData, setFormData] = useState<T_RegistrationForm>(initialFormData);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [currentView, setCurrentView] = useState<T_CurrentView>("contact");

    // This function updates our form state
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | T_SyllabusEvent) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    // This function updates our form state for the course select
    const handleSelectChange = (name: string, value: string[]) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // A very basic form validation function.
    const validateContactView = (): boolean => {
        let errors = { ...initialFormErrors };
        let isValid = true;

        // Validate first name
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
            isValid = false;
        }

        // Validate last name
        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = "Email is invalid";
            isValid = false;
        }

        // Validate phone
        // This is a very basic check, just to see if anything is entered.
        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    }

    /**
     * This function validates the current view
     * before moving to the next view.
     */
    const validateCurrentView = (): boolean => {
        if (currentView === "contact") {
            return validateContactView();
        }
        // TODO: Add validation for other views

        return true;
    }

    // Advances to the next view
    const nextView = () => {
        const currentViewIndex = views.indexOf(currentView);
        if (validateCurrentView() && currentViewIndex < views.length - 1) {
            setCurrentView(views[currentViewIndex + 1] as T_CurrentView);
        }
    }

    // Goes back to the previous view
    const previousView = () => {
        const currentViewIndex = views.indexOf(currentView);
        if (currentViewIndex > 0) {
            setCurrentView(views[currentViewIndex - 1] as T_CurrentView);
        }
    }

    // Resets the form, errors and returns to contact view
    const resetForm = () => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
        setCurrentView("contact");
    }

    /**
     * This is our context object.
     * This will be passed down to our children.
     * All objects and functions you want to be
     * available to all components should be
     * included here.
     */
    const context = {
        formData,
        setFormData,
        formErrors,
        handleFormChange,
        handleSelectChange,
        currentView,
        setCurrentView,
        nextView,
        previousView,
        resetForm,
    }

    return (
        <RegistrationFormContext.Provider value={context} >
            {children}
        </RegistrationFormContext.Provider>
    );
};

// This hook will be used to access our form context
export const useRegistrationForm = (): T_RegistrationFormContext => {
    const context = useContext(RegistrationFormContext);
    if (!context) {
        throw new Error("useRegistrationForm must be used within a RegistrationFormContext");
    }
    return context;
};