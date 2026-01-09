import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simple password hashing for demo (NOT production-ready)
const hashPassword = (password) => {
    return btoa(password); // Base64 encoding
};

const validatePassword = (password, hash) => {
    return btoa(password) === hash;
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('fintech-current-user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse stored user:', e);
            }
        }
        setLoading(false);
    }, []);

    // Get all users from localStorage
    const getAllUsers = () => {
        const usersData = localStorage.getItem('fintech-users');
        return usersData ? JSON.parse(usersData) : {};
    };

    // Save users to localStorage
    const saveUsers = (users) => {
        localStorage.setItem('fintech-users', JSON.stringify(users));
    };

    // Signup function
    const signup = (name, email, password) => {
        const users = getAllUsers();

        // Check if user already exists
        if (users[email]) {
            throw new Error('User with this email already exists');
        }

        // Validate inputs
        if (!name || name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters');
        }

        if (!email || !email.includes('@')) {
            throw new Error('Please enter a valid email');
        }

        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Create new user
        const userId = `u_${Date.now()}`;
        const newUser = {
            id: userId,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword(password),
            createdAt: new Date().toISOString(),
        };

        // Save user
        users[newUser.email] = newUser;
        saveUsers(users);

        // Set as current user
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        };
        setCurrentUser(userSession);
        localStorage.setItem('fintech-current-user', JSON.stringify(userSession));

        return userSession;
    };

    // Login function
    const login = (email, password) => {
        const users = getAllUsers();
        const user = users[email.toLowerCase().trim()];

        if (!user) {
            throw new Error('No account found with this email');
        }

        if (!validatePassword(password, user.password)) {
            throw new Error('Incorrect password');
        }

        // Set as current user
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        setCurrentUser(userSession);
        localStorage.setItem('fintech-current-user', JSON.stringify(userSession));

        return userSession;
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('fintech-current-user');
    };

    const value = {
        currentUser,
        login,
        signup,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
