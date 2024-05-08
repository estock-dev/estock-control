import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { User } from '../../Types/user';
import { RootState } from '../store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';

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
                throw new Error('User not found.');
            }
        } catch (error) {
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

export const signOutUser = createAsyncThunk<void, void, { state: RootState }>(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await firebaseSignOut(getAuth());
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred during the sign out');
        }
    }
);

// Slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
            state.authenticated = !!action.payload;
            state.error = null;
        },
        signOut: (state) => {
            state.authenticated = false;
            state.currentUser = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.authenticated = true;
                state.loading = false;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.authenticated = false;
                state.currentUser = null;
                state.error = action.payload || 'Um erro desconhecido aconteceu durante o sign in.';
            })
            .addCase(signOutUser.fulfilled, (state) => {
                state.authenticated = false;
                state.currentUser = null;
            });
    },
});

export const { setUser, signOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
