import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingView() {
    return (
        <motion.div
            key={'loading'}
            initial={{ scale: 0.5 }} // Start above the view
            animate={{ scale: 1 }} // Bounce in to the center
            exit={{ scale: 0 }} // Exit down
            transition={{ type: 'spring', stiffness: 200, damping: 10 }} // This gives the bounce effect
            className="flex flex-col gap-6"
        >
            <h1 className="text-2xl text-center font-bold animate-pulse m-auto text-sky-600">Processing Payment...</h1>
        </motion.div>
    )
}
