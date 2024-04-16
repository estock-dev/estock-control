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
                    throw new Error('Formato inválido de dados do usuário.');
                }
            } else {
                throw new Error('Usuário não encontrado.');
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                if ('code' in error) {
                    return rejectWithValue((error as { code: string }).code);
                } else {
                    return rejectWithValue(error.message);
                }
            } else {
                return rejectWithValue('Um erro desconhecido aconteceu durante o sign in.');
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
                    throw new Error('Formato inválido de dados do usuário.');
                }
            } else {
                throw new Error('Usuário não encontrado.');
            }
        } catch (error) {
            // Error handling improved
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Um erro desconhecido aconteceu durante o sign in.');
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
            return rejectWithValue('Um erro desconhecido aconteceu durante o sign out');
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
            throw new Error('Usuário não encontrado.');
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
                if (action.payload && 'uid' in action.payload) {
                    state.authenticated = true;
                    state.currentUser = action.payload;
                } else {
                    state.authenticated = false;
                    state.currentUser = null;
                    state.error = 'Dados do usuário inválidos.';
                }
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
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                const uid = state.currentUser?.uid || 'default-uid';
                state.currentUser = { ...action.payload, uid };
                state.authenticated = true;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Um erro desconhecido aconteceu ao buscar as informações do usuário.';
            });
    },
});

export const { signOut, updateUser, setUser, authenticateUser } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
