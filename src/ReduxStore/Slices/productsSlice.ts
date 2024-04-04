import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from  '../../Configuration/firebase'

export type ProductItem = {
  id: string;
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
  // Add other properties as needed
};

export interface CartItem {
  id: string;
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
}

type ProductsState = {
  products: ProductItem[];
  currentProduct: ProductItem | null; // Add a state field for the current product
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  products: [],
  currentProduct: null, // Initialize currentProduct as null
  loading: false,
  error: null,
};

export const updateProductQuantity = createAsyncThunk<
  void,
  { id: string; adjustment: number },
  { rejectValue: string }
>(
  'products/updateProductQuantity',
  async ({ id, adjustment }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as { products: ProductsState };
      const product = state.products.products.find((p) => p.id === id);

      if (!product) {
        return rejectWithValue('Product not found');
      }

      const newQuantity = product.qtd + adjustment;
      if (newQuantity < 0) {
        return rejectWithValue('Cannot reduce quantity below 0');
      }

      // Update Firestore document
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { qtd: newQuantity });

      // Optionally, dispatch an action to update local state immediately
      // or rely on fetching updated data from Firestore
      dispatch(productQuantityUpdated({ id, qtd: newQuantity }));
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while updating product quantity.');
    }
  }
);


export const fetchProducts = createAsyncThunk<ProductItem[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<ProductItem, 'id'>),
      }));
      return productsArray;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while fetching products.');
    }
  }
);

// Async thunk for fetching a single product by its ID
export const fetchProductById = createAsyncThunk<ProductItem, string, { rejectValue: string }>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      // Ensure the data structure matches what you expect
      if (docSnap.exists() && docSnap.data()) {
        const data = docSnap.data();
        // Potentially, add additional validation for the data fields if necessary
        if (typeof data.marca === 'string' && typeof data.modelo === 'string' && typeof data.nome === 'string' && typeof data.qtd === 'number') {
          return { id: docSnap.id, ...data as Omit<ProductItem, 'id'> };
        } else {
          // The document data did not match the expected shape
          return rejectWithValue('Product data is malformed');
        }
      } else {
        // Document does not exist
        return rejectWithValue('Product not found');
      }
    } catch (error) {
      // General error handling
      if (error instanceof Error) {
        console.error('Error fetching product:', error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while fetching the product.');
    }
  }
);


export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Reducer to clear the current product
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    productQuantityUpdated(state, action: PayloadAction<{ id: string; qtd: number }>) {
      const index = state.products.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index].qtd = action.payload.qtd;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products.';
      })
      // Handle the fetchProductById actions
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload; // Set the fetched product as currentProduct
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product.';
      });
  },
});

export const { clearCurrentProduct, productQuantityUpdated } = productsSlice.actions;
export default productsSlice.reducer;