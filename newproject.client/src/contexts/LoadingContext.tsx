import React, { createContext, useContext, useState } from 'react';
export interface LoadingContextType {
    loading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const requestCountRef = React.useRef(0);
    const showLoader = () => {
        requestCountRef.current += 1;
        setLoading(true);
    };
    const hideLoader = () => {
        if (requestCountRef.current <= 1) {
            setLoading(false);
            requestCountRef.current = 0;
        } else {
            requestCountRef.current -= 1;
        }
    };
    return (
        <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
        </LoadingContext.Provider>
    );
};
export const useLoader = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoadingProvider');
    }
    return context;
};
