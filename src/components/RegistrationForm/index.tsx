"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";

import ContactView from "./ContactView";
import SyllabusView from "./SyllabusView";
import PaymentView from "./PaymentView";
import LoadingView from "./LoadingView";
import ConfirmationView from "./ConfirmationView";

import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { BsCreditCard2BackFill } from 'react-icons/bs'

import { useRegistrationForm } from "@/contexts/RegistrationFormContext";

export default function RegistrationForm() {
    const { currentView, setCurrentView, previousView, nextView } = useRegistrationForm();

    const viewsOrder = ["contact", "syllabus", "payment"];
    const isFirstView = currentView === viewsOrder[0];
    const isLastView = currentView === viewsOrder[viewsOrder.length - 1];
    const isLoadingView = currentView === "loading";
    const isConfirmationView = currentView === "confirmation";

    // Payment action handler
    const handlePayment = async () => {
        setCurrentView("loading");
        await new Promise(r => setTimeout(r, 3000));
        setCurrentView("confirmation");
    };

    return (
        <form className="flex flex-col gap-10 md:h-[500px] bg-zinc-50 p-8 w-full md:w-[700px] rounded-lg shadow overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-3xl font-bold text-center">Registration Form</h1>
            <AnimatePresence mode='wait' initial={false}>
                {
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
