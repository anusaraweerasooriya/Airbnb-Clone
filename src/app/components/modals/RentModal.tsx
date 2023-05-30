"use client";

import useRentModal from "@/app/hooks/useRentModal";
import { useState } from "react";

import Modal from "./Modal";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}


const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);

    return (
        <Modal 
            title="Airbnb your home" 
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={rentModal.onClose}
            actionLabel="Submit"

         />
    );
}

export default RentModal;