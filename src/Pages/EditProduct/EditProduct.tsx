import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db, storage } from '../../Configuration/firebase'
import { Container, TextField, Button, Box } from '@mui/material';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newImage = event.target.files[0];
      setNewImage(newImage);

      const imageRef = ref(storage, `products/${Date.now()}_${newImage.name}`);
      await uploadBytes(imageRef, newImage);
      const photoURL = await getDownloadURL(imageRef);

      setProduct({ ...product, photoURL }); // Update local state to reflect the new image
      // Optionally, if you want to immediately save the new image URL to Firestore
      // const productRef = doc(db, 'products', id!);
      // await updateDoc(productRef, { photoURL });
    }
  };

  const handleSave = async () => {
    if (newImage) {
      // If there's a new image, we handle the upload in the save function
      const imageRef = ref(storage, `products/${Date.now()}_${newImage.name}`);
      const uploadTaskSnapshot = await uploadBytes(imageRef, newImage);
      const photoURL = await getDownloadURL(uploadTaskSnapshot.ref);
      await updateDoc(doc(db, 'products', id!), {
        ...product,
        photoURL // Update the product's photoURL in the Firestore document
      });
    } else {
      // If there isn't a new image, just update the other product details
      await updateDoc(doc(db, 'products', id!), {
        ...product
      });
    }
    navigate('/view-products');
  };

  const handleImageDelete = async () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      if (product.photoURL) {
        const imageRef = ref(storage, product.photoURL);
        await deleteObject(imageRef);
        await updateDoc(doc(db, 'products', id!), {
          photoURL: deleteField()
        });
        setProduct({ ...product, photoURL: null });
      }
    }
  };

  if (isLoading) {
    return <Container maxWidth="sm"><div>Loading...</div></Container>;
  }


  return (
    <Container maxWidth="sm">
      <h1>Edit Product</h1>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 2,
        mb: 2
      }}>
        <img src={product.photoURL || 'placeholder-image.png'} alt="Product" style={{ maxWidth: '300px', height: 'auto', marginBottom: '8px' }} />
        <Button
          variant="contained"
          component="label"
          sx={{
            marginBottom: '4px',
            width: 'auto',
            padding: '6px 12px', // Smaller padding
            fontSize: '0.75rem', // Smaller font size
          }}>
          Change Image
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleImageDelete}
          sx={{
            width: 'auto',
            padding: '6px 12px', // Smaller padding
            fontSize: '0.75rem', // Smaller font size
          }}>
          Delete Image
        </Button>
      </Box>
      <TextField
        fullWidth
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Price"
        name="price"
        value={product.price}
        onChange={handleChange}
        margin="normal"
        type="number"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        multiline
        rows={4}
        value={product.description}
        onChange={handleChange}
        margin="normal"
      />
        <TextField
        fullWidth
        label="Product Code"
        name="code"
        value={product.code}
        onChange={handleChange}
        margin="normal"
        disabled // You might want to make this field read-only
      />
      <TextField
        fullWidth
        label="Quantity"
        name="quantity"
        value={product.quantity}
        onChange={handleChange}
        margin="normal"
        type="number"
      />
      
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={() => navigate('/view-products')}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Container>
  );
}

export default EditProduct;
