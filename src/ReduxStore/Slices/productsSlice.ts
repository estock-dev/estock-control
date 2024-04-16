import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { query, where, collection, getDocs, doc, getDoc, updateDoc, FirestoreError } from 'firebase/firestore';
import { db } from  '../../Configuration/firebase'
import type { RootState } from '../store';


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

interface Model {
  name: string;
  // ...other properties
}

interface ProductsState {
  products: ProductItem[];
  currentProduct: ProductItem | null;
  includeQuantity: boolean; // Newly added state
  selectedKey: string; // Newly added state
  formattedMessage: string; // Newly added state
  loading: boolean;
  error: string | null;
  selectedProducts: ProductItem[];
  brands: string[];
  models: string[];
}


const initialState: ProductsState = {
  products: [],
  currentProduct: null, 
  loading: false,
  error: null,
  includeQuantity: false, 
  selectedKey: 'marcas', 
  formattedMessage: '',
  selectedProducts: [],
  brands: [],
  models: [],
};


export const updateProductQuantity = createAsyncThunk<
  void,
  { id: string; adjustment: number },
  { state: RootState, rejectValue: string }
>(
  'products/updateProductQuantity',
  async ({ id, adjustment }, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const product = state.products.products.find((p) => p.id === id);

    if (!product) {
      return rejectWithValue('Product not found');
    }

    const newQuantity = product.qtd + adjustment;
    if (newQuantity < 0) {
      return rejectWithValue('Cannot reduce quantity below 0');
    }

    // Optimistically update the state first
    dispatch(productQuantityUpdated({ id, qtd: newQuantity }));

    try {
      // Update Firestore document
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { qtd: newQuantity });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating product quantity:', error);
        // Revert state update if Firestore update fails
        dispatch(productQuantityUpdated({ id, qtd: product.qtd }));
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while updating product quantity.');
    }
  }
);

export const fetchModelsForBrand = createAsyncThunk<string[], string, { rejectValue: string }>(
  'products/fetchModelsForBrand',
  async (brand, { rejectWithValue }) => {
    try {
      const modelsQuery = query(collection(db, 'models'), where('brand', '==', brand));
      const querySnapshot = await getDocs(modelsQuery);
      // TypeScript now understands the shape of your data
      const models = querySnapshot.docs.map((doc) => (doc.data() as Model).name);
      return models;
    } catch (error) {
      // If error is an instance of FirestoreError, you can get more detailed error information
      if (error instanceof FirestoreError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while fetching models.');
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

export const selectAllBrands = (state: RootState) => {
  const brands = state.products.products.map((product) => product.marca);
  return [...new Set(brands)]; // Return unique brands
};

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
        // Use Immer's ability to handle state updates immutably
        state.products[index].qtd = action.payload.qtd;
      }
    },
    setSelectedKey(state, action: PayloadAction<string>) {
      state.selectedKey = action.payload;
    },
    toggleQuantityIncluded(state) {
      state.includeQuantity = !state.includeQuantity;
    },
    setFormattedMessage(state, action: PayloadAction<string>) {
      state.formattedMessage = action.payload;
    },
    selectProduct(state, action: PayloadAction<ProductItem>) {
      state.selectedProducts.push(action.payload);
    },
    removeSelectedProduct(state, action: PayloadAction<string>) {
      state.selectedProducts = state.selectedProducts.filter(product => product.id !== action.payload);
    },
    setIncludeQuantity(state, action: PayloadAction<boolean>) {
      state.includeQuantity = action.payload;
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
        state.brands = action.payload.map((product) => product.marca);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products.';
      })
      .addCase(fetchModelsForBrand.fulfilled, (state, action) => {
        state.models = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload; 
        
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product.';
      });
  },
});

export const { clearCurrentProduct, productQuantityUpdated, setFormattedMessage, setSelectedKey, toggleQuantityIncluded, selectProduct, removeSelectedProduct, setIncludeQuantity } = productsSlice.actions;

export default productsSlice.reducer;