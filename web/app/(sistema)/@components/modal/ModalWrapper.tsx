"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/useAuthContext";

interface ModalProps {
  componente: React.ReactNode;
}

const ModalWrapper: React.FC<ModalProps> = ({ componente }) => {
  const { isModalOpen, closeModal } = useAuth();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const mouseDownInside = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current?.contains(e.target as Node)) {
      mouseDownInside.current = true;
    } else {
      mouseDownInside.current = false;
    }
  };

  const handleBackdropClick = () => {
    if (!mouseDownInside.current) {
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div
          className="relative w-full overflow-hidden"
          onMouseDown={handleMouseDown}
          onClick={handleBackdropClick}
        >
          <div className="fixed inset-0  flex items-center justify-center bg-black-main/20 z-[1300]">
            <motion.div
              initial={{ bottom: "-250%" }}
              animate={{ bottom: "0" }}
              ref={modalRef}
              exit={{ bottom: "-250%" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="px-6 py-16 w-full max-w-[1440px] bg-white-main rounded-main  max-h-[850px] absolute top-0 my-auto  h-fit overflow-y-auto modales"
            >
              <button
                onClick={closeModal}
                className="absolute text-red-700 top-2 right-2"
              >
                ✖
              </button>
              <div className="h-fit">{componente}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;
