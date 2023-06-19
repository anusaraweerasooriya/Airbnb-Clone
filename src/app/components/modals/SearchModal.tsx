"use client";

import { formatISO } from "date-fns";
import qs from 'query-string';

import { useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";

import useSearchModal from "@/app/hooks/useSearchModal";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import { CountrySelectValue } from "../inputs/CountrySelect";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {

    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    });

    const Map = useMemo(() => dynamic(() => import("../Map"), {
        ssr: false,
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if(step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updateQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if (dateRange.startDate) {
            updateQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updateQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: "/",
            query: updateQuery
        }, { skipNull: true});

        setStep(STEPS.LOCATION);
        searchModal.onClose();
        
        router.push(url);
    }, 
    [
        bathroomCount,
        dateRange.endDate,
        dateRange.startDate,
        guestCount,
        location?.value,
        onNext, 
        params, 
        roomCount, 
        router, 
        searchModal, 
        step
    ]);

    return (
        <Modal 
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={searchModal.onOpen}
            title="filters"
            actionLabel="Search"
        />
    );
}

export default SearchModal;