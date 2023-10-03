import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface iUser {
	id: string;
	username: string;
	email: string;
	wallet: number;
	avatar?: any;
	currency: string;
}
const UserContext = createContext<iUser | null>(null);
const UserUpdateContext = createContext<((user: iUser | null) => void)>(() => {});

export function useUser() {
	return useContext(UserContext);
}
export function useUserUpdate() {
	return useContext(UserUpdateContext);
}

interface UserProviderProps {
	children: ReactNode;
}
export function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<iUser | null>(null);
	const updateUser = (user: iUser | null) => {
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
	}

	useEffect(function() {
		const userFromStorage = localStorage.getItem("user");
		if (userFromStorage != "undefined") setUser(JSON.parse(userFromStorage as string));
	}, []);

	return (
		<UserContext.Provider value={user}>
			<UserUpdateContext.Provider value={updateUser}>
				{children}
			</UserUpdateContext.Provider>
		</UserContext.Provider>
	);
}