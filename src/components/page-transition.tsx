"use client";

import { motion, type Transition } from "framer-motion";
import { usePathname } from "next/navigation";

const enterTransition: Transition = {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1],
};

const exitTransition: Transition = {
    duration: 0.15,
    ease: [0.25, 0.1, 0.25, 1],
};

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: enterTransition }}
            exit={{ opacity: 0, y: -4, transition: exitTransition }}
            className="will-change-[opacity,transform]"
        >
            {children}
        </motion.div>
    );
}
