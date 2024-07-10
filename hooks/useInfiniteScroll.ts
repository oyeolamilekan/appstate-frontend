import { useState, useEffect } from "react";

export const useInfiniteScroll = (callback: Function, ref: React.RefObject<HTMLDivElement>) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            if (element.scrollHeight - element.scrollTop !== element.clientHeight || isFetching) return;
            setIsFetching(true);
        };

        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [ref, isFetching]);

    useEffect(() => {
        if (!isFetching) return;
        callback();
    }, [isFetching, callback]);

    return { isFetching, setIsFetching };
};
