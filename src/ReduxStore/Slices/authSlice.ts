import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, } from 'firebase/auth'
import { getAuth } from 'firebase/auth';
import { User } from '../../Types/user'
import { RootState } from '../store'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase'

type AuthState = {
    authenticated: boolean;
    currentUser: User | null;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    authenticated: false,
    currentUser: null,
    loading: false,
    error: null,
};

// Async thunk for signing in
export const signIn = createAsyncThunk<User, { email: string; password: string }, { state: RootState, rejectValue: string }>(
    'auth/signIn',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const userDocRef = doc(db, 'users', uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data() as User | undefined;
                if (userData) {
                    const { uid, ...rest } = userData;
                    return { uid, ...rest };
                } else {
                    throw new Error('Invalid user data format.');
                }
            } else {
                throw new Error('User details not found.');
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                if ('code' in error) {
                    return rejectWithValue((error as { code: string }).code);
                } else {
                    return rejectWithValue(error.message);
                }
            } else {
                return rejectWithValue('An unknown error occurred during sign in.');
            }
        }
    }
);

export const fetchUserDetails = createAsyncThunk<User, string, { state: RootState, rejectValue: string }>(
    'auth/fetchUserDetails',
    async (uid, { rejectWithValue }) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                if (userData) {
                    return { ...userData as User, uid };
                } else {
                    throw new Error('Invalid user data format.');
                }
            } else {
                throw new Error('User details not found.');
            }
        } catch (error) {
            // Error handling improved
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred while fetching user details.');
            }
        }
    }
);

export const signOutUser = createAsyncThunk<void, void, { state: RootState }>(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await firebaseSignOut(getAuth());
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const updateUserDetails = createAsyncThunk<User, User, { state: RootState }>(
    'user/updateUserDetails',
    async (userData) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
            return userData;
        } else {
            throw new Error('No user found');
        }
    }
);

export const selectIsAdmin = (state: RootState) => {
    return state.auth.currentUser && true;
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            // Update the user details in the Redux state
            if (state.currentUser && action.payload) {
                state.currentUser = {
                    ...state.currentUser,
                    ...action.payload,
                };
            }
        },
        authenticateUser: (state) => {
            state.authenticated = true;
        },
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
        signOut: (state) => {
            state.authenticated = false;
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                // If the payload has the uid, consider the user authenticated
                if (action.payload && 'uid' in action.payload) {
                    state.authenticated = true;
                    state.currentUser = action.payload;
                } else {
                    // If not, reset the auth state
                    state.authenticated = false;
                    state.currentUser = null;
                    state.error = 'Invalid user data';
                }
                state.loading = false;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.authenticated = false; // Explicitly set authenticated to false
                state.currentUser = null; // Clear the current user
                state.error = action.payload || 'An unknown error occurred during sign in.';
            })
            .addCase(signOutUser.fulfilled, (state) => {
                state.authenticated = false;
                state.currentUser = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                const uid = state.currentUser?.uid || 'default-uid'; // Replace 'default-uid' with an appropriate fallback.
                state.currentUser = { ...action.payload, uid };
                state.authenticated = true; // Set authenticated true upon successful fetch
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred while fetching user details.';
            });
    },
});

export const { signOut, updateUser, setUser, authenticateUser } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
