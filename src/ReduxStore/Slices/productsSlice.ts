import { createSlice, createAsyncThunk, PayloadAction, createAction } from '@reduxjs/toolkit';
import { query, where, collection, getDocs, doc, getDoc, updateDoc, FirestoreError } from 'firebase/firestore';
import { db } from  '../../Configuration/firebase'
import type { RootState } from '../store';


export type ProductItem = {
  id: string;
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
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
}

interface ProductsState {
  products: ProductItem[];
  currentProduct: ProductItem | null;
  includeQuantity: boolean; 
  selectedKey: string; 
  formattedMessage: string; 
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
      return rejectWithValue('Produto não encontrado!');
    }

    const newQuantity = product.qtd + adjustment;
    if (newQuantity < 0) {
      return rejectWithValue('Não pode reduzir a quantidade abaixo de 0.');
    }

    dispatch(productQuantityUpdated({ id, qtd: newQuantity }));

    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { qtd: newQuantity });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao atualizar a quantidade do produto:', error);
        dispatch(productQuantityUpdated({ id, qtd: product.qtd }));
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Um erro desconhecido ocorreu ao atualizar a quantidade do produto:.');
    }
  }
);

export const fetchModelsForBrand = createAsyncThunk<string[], string, { rejectValue: string }>(
  'products/fetchModelsForBrand',
  async (brand, { rejectWithValue }) => {
    try {
      const modelsQuery = query(collection(db, 'models'), where('brand', '==', brand));
      const querySnapshot = await getDocs(modelsQuery);
      const models = querySnapshot.docs.map((doc) => (doc.data() as Model).name);
      return models;
    } catch (error) {
      if (error instanceof FirestoreError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Um erro desconhecido ocorreu ao buscar modelos');
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
      return rejectWithValue('Um erro desconhecido ocorreu ao buscar os produtos.');
    }
  }
);


export const fetchProductById = createAsyncThunk<ProductItem, string, { rejectValue: string }>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);


      if (docSnap.exists() && docSnap.data()) {
        const data = docSnap.data();
        if (typeof data.marca === 'string' && typeof data.modelo === 'string' && typeof data.nome === 'string' && typeof data.qtd === 'number') {
          return { id: docSnap.id, ...data as Omit<ProductItem, 'id'> };
        } else {
          return rejectWithValue('Os dados do produto estão malformados');
        }
      } else {
        return rejectWithValue('Produto não encontrado');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar produto:', error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Um erro desconhecido ocorreu ao buscar o produto.');
    }
  }
);

export const setCurrentProduct = createAction<{ id: string }>('products/setCurrentProduct');

export const selectAllBrands = (state: RootState) => {
  const brands = state.products.products.map((product) => product.marca);
  return [...new Set(brands)]; 
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    productQuantityUpdated(state, action: PayloadAction<{ id: string; qtd: number }>) {
      const index = state.products.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) {
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
    setCurrentProduct(state, action: PayloadAction<{ id: string }>) {
      state.currentProduct = state.products.find(p => p.id === action.payload.id) || null;
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
        state.error = action.payload || 'Falha ao buscar produtos.';
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
        state.error = action.payload || 'Falha ao buscar produtos.';
      });
  },
});

export const { clearCurrentProduct, productQuantityUpdated, setFormattedMessage, setSelectedKey, toggleQuantityIncluded, selectProduct, removeSelectedProduct, setIncludeQuantity } = productsSlice.actions;

export default productsSlice.reducer;