import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/route';
import { useSelector } from 'react-redux';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const currentUser = useSelector((state: any) => state.auth.login.currentUser);
    const [user, setUser] = useState<User | null>(currentUser);
    useEffect(() => {
        console.log(user);

        setUser(currentUser);
    }, [currentUser])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
