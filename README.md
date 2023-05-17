In today's digitally-driven world, an efficient and engaging user experience (UX) is paramount. The cornerstone of this experience often comes down to one pivotal aspect: form design. Forms are the primary medium for users to interact with online platforms, from signing up for a service to making a purchase. However, if not designed thoughtfully, forms can be daunting, leading to user drop-off and missed opportunities.

The key to mitigating this issue lies in breaking down your forms into smaller, manageable sections, or 'chunks'. Chunking information is a proven cognitive strategy that leverages the human brain's ability to more easily process and remember information presented in bite-sized units. When it comes to forms, presenting information in chunks can reduce cognitive load, make the process seem less overwhelming, and ultimately increase completion rates.

But how can we make this chunking process more engaging and fluid? This is where Framer Motion comes into play. As a popular open-source motion library, Framer Motion provides a comprehensive platform for infusing your React / Next.js applications with smooth, captivating animations.

In this article, we'll delve into the power of 'chunking' your forms and enhancing this process with the dynamic capabilities of Framer Motion. By animating transitions between form sections, we can create a more engaging, less intimidating experience for users. Through this approach, we aim to improve form completion rates, reduce user fatigue, and ultimately, elevate the overall UX of your applications.

The project demo site and GitHub repo for this tutorial can be found at the bottom of the page.

The demo project I created for this tutorial is a mock registration form for an online course. It's very basic and its lacking in any serious validation logic. Our form will be broken into the following views:

1. Contact Information View
2. Course Selection View
3. Payment View
4. Payment Loading View
5. Confirmation View

## Setting Up Our Project

This project uses the very latest version of Next.js 13, TypeScript and TailwindCSS + DaisyUI: a component library plugin for Tailwind. I highly recommend it. It's totally customizable, theme-able and really speeds up UI development.

This project also uses:

1. framer-motion - For animating slide transitions
2. react-icons - I mean, you gotta have icons!
3. react-input-mask - for formatting inputs
4. react-select - a very nice and simple multi-select component

Also, we're going to be using the new app router in Next.js 13... yes, it's time. It's not quite ready for production, in my opinion, but it's very close--and all the major vendors are starting to catch up as well. I think anyone planning to start a new Next.js project at this time should seriously consider using the app router. It's a massive improvement in performance. Our app, however, really won't benefit as it is all client-side code.

## Create a Form Context

Because our form is being broken into smaller component chunks, we need a way to tie all the state data together. To do that, we'll create a React context wrapper that will handle all functions and data related to our form:

```jsx
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
```

As you can see, this context handles not just managing our form state, but also manages our current view, validation and navigation as well. Note: for sake of keeping this article sane in length, I've left out the type declarations file. You can find that [here](https://github.com/designly1/next-framer-form-example/blob/master/src/components/RegistrationForm/RegistrationForm.d.ts).

## Building Our Components

First, we need create our main form component and wrap it in our context provider.

Here's our main `page.tsx` file:

```jsx
import RegistrationForm from "@/components/RegistrationForm";
import { RegistrationFormProvider } from "@/contexts/RegistrationFormContext";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around">
      <RegistrationFormProvider>
        <RegistrationForm />
      </RegistrationFormProvider>
    </main>
  );
}
```

Pretty self-explanatory. And now for our main form component:

```jsx
"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";

// Import our view sub-components
import ContactView from "./ContactView";
import SyllabusView from "./SyllabusView";
import PaymentView from "./PaymentView";
import LoadingView from "./LoadingView";
import ConfirmationView from "./ConfirmationView";

// Icons
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { BsCreditCard2BackFill } from 'react-icons/bs'

// Hooks
import { useRegistrationForm } from "@/contexts/RegistrationFormContext";

export default function RegistrationForm() {
    // Destructure our registration form context
    const { currentView, setCurrentView, previousView, nextView } = useRegistrationForm();

    /**
     * We only include our interactive views here.
     * Our buttons will be conditionally rendered based on the current view.
     */
    const viewsOrder = ["contact", "syllabus", "payment"];
    // Logic for handling navigation
    const isFirstView = currentView === viewsOrder[0];
    const isLastView = currentView === viewsOrder[viewsOrder.length - 1];
    const isLoadingView = currentView === "loading";
    const isConfirmationView = currentView === "confirmation";

    // Payment action handler - fake API call
    const handlePayment = async () => {
        setCurrentView("loading");
        await new Promise(r => setTimeout(r, 3000));
        setCurrentView("confirmation");
    };

    return (
        <form
            className="flex flex-col gap-10 md:h-[500px] bg-zinc-50 p-8 w-full md:w-[700px] rounded-lg shadow overflow-y-auto"
            onSubmit={(e) => e.preventDefault()}
        >
            <h1 className="text-3xl font-bold text-center">Registration Form</h1>
            {/** 
             * We use AnimatePresence to allow animation upon mounting or 
             * unmounting of our views.
             * 
             * mode='wait' will wait for the animation to complete before unmounting
             * 
             * initial={false} will prevent the first view from animating when the page loads
             * for the first time.
             * 
             */}
            <AnimatePresence mode='wait' initial={false}>
                {
                    /**
                     * We use a short-hand switch statement
                     * to conditionally render our views
                     */
                    {
                        'contact': <ContactView />,
                        'syllabus': <SyllabusView />,
                        'payment': <PaymentView />,
                        'loading': <LoadingView />,
                        'confirmation': <ConfirmationView />,
                    }[currentView]
                }
            </AnimatePresence>
            {
                /**
                 * This is our logic to conditionally render our navigation buttons.
                 */
                !isConfirmationView && !isLoadingView &&
                <div className="flex gap-12 items-center justify-center mt-auto">
                    {!isFirstView && (
                        <button className="btn flex gap-2 w-40" onClick={previousView}>
                            <FaRegArrowAltCircleLeft className="text-2xl" /> Previous
                        </button>
                    )}
                    {isLastView ? (
                        <button className="btn flex gap-2 w-40 btn-success" onClick={handlePayment}>
                            Payment <BsCreditCard2BackFill className="text-2xl" />
                        </button>
                    ) : (
                        <button className="btn flex gap-2 w-40" onClick={nextView}>
                            Next <FaRegArrowAltCircleRight className="text-2xl" />
                        </button>
                    )}
                </div>
            }
        </form>
    );
}
```

The `AnimatePresence` component from Framer Motion is used to handle the animation and presence of components when they enter or exit the DOM. It provides a declarative way to define and control the animation of components based on their presence in the React component tree. The `wait` attribute tells framer motion to wait for the animation to complete before unmounting it. Also, setting `initial={false}` prevents any animation from firing when the component first loads. Subsequent mounts and unmounts will be animated, however.

Ok, now that we've done most of the heavy lifting, we have only left to create our individual form views. Again, for sake of brevity, I will only include the first view in this article. Please see the repository for all project files!

```jsx
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
```

If you're unfamiliar with framer-motion, or this use-case is new to you, then here's a breakdown of what the attributes do:

1. `<motion.div>`: A special div provided by the Framer Motion library. Like a regular HTML div, but it comes with extra props that allow you to animate the div.

2. `key={'contact'}`: In React, the `key` prop is used to identify elements in a list for performance reasons. In this case, 'contact' is the key for this element. This is super crucial for framer-motion to prevent unnecessary re-renders and data loss.

3. `initial={{ translateX: '1200px' }}`: This is a prop provided by Framer Motion. This sets the initial state of the animation. Here, the div will start 1200 pixels to the right of its natural position.

4. `animate={{ translateX: '0' }}`: This sets the final state of the animation. Here, the div will end up in its natural position (0 pixels to the right or left of where it would normally be).

5. `exit={{ translateX: '-1200px' }}`: This sets the exit state of the animation. This would be triggered if the component is unmounted from the DOM. Here, the div will end up 1200 pixels to the left of its natural position when it is removed.

---

## Summing it Up

As you can see, using Framer Motion to create better user experiences for forms by breaking them up into smaller chunks and animating the transitions between sections can greatly enhance the overall user experience. By dividing complex forms into smaller, more manageable sections, users are less likely to feel overwhelmed and can focus better on providing accurate information.

Also, by using context and state management, such as with React Context and TypeScript, we can maintain consistent and shared form data across different sections, enabling seamless communication and data validation between form components.

Links:

1.  [GitHub Repo](https://github.com/designly1/next-framer-form-example)
2. [Demo Page](https://next-framer-form-example.vercel.app/)

---

Thank you for taking the time to read my article and I hope you found it useful (or at the very least, mildly entertaining). For more great information about web dev, systems administration and cloud computing, please read the [Designly Blog](https://designly.biz/blog). Also, please leave your comments! I love to hear thoughts from my readers.

I use [Hostinger](https://hostinger.com?REFERRALCODE=1J11864) to host my clients' websites. You can get a business account that can host 100 websites at a price of $3.99/mo, which you can lock in for up to 48 months! It's the best deal in town. Services include PHP hosting (with extensions), MySQL, Wordpress and Email services.

Looking for a web developer? I'm available for hire! To inquire, please fill out a [contact form](https://designly.biz/contact).