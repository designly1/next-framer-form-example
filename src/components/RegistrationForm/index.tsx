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
