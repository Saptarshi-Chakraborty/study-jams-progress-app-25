// /context/GlobalContext.tsx
import { account } from "@/lib/appwrite";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

export const ROLES = {
    ADMIN: "admin",
    ORGANISER: "organiser",
    TEAM_MEMBER: "team_member",
    PARTICIPANT: "participant"
};

const GlobalContext = createContext(undefined);


export function GlobalContextProvider({
    children,
}) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Start with true

    const checkAuth = useCallback(async () => {
        // Skip if we're already checking

        setIsCheckingAuth(true);
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            // Clear user if unauthorized or any other error
            setUser(null);
            // Don't log error for unauthorized requests
            if (error.code !== 401) {
                console.error("Auth check error:", error);
            }
        } finally {
            setIsCheckingAuth(false);
        }
    }, []); // Correct: Dependency array is empty

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                session,
                setSession,
                checkAuth,
                isCheckingAuth,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error(
            "useGlobalContext must be used within a GlobalContextProvider"
        );
    }
    return context;
}

export default GlobalContext;