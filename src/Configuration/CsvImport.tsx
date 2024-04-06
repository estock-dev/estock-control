import React from 'react';
import Papa from 'papaparse';
import { collection, doc } from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';
import { db } from '../Configuration/firebase';
import { Button } from '@mui/material';

const ImportProductsCSV = () => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    uploadProducts(result.data as { marca: string; modelo: string; nome: string; qtd: number; }[]);
                },
                header: true, // Assumes your CSV has headers
                skipEmptyLines: true,
            });
        }
    };

    const uploadProducts = async (products: { marca: string; modelo: string; nome: string; qtd: number; }[]) => {
        const collectionRef = collection(db, 'products');
        let batch = writeBatch(db);
        const BATCH_SIZE = 500; // Firestore limits batches to 500 operations

        for (let i = 0; i < products.length; i++) {
            const docRef = doc(collectionRef); // automatically generate new document IDs
            batch.set(docRef, products[i]);

            // Commit the batch every 500 writes and start a new batch
            if (i % BATCH_SIZE === 0) {
                await batch.commit();
                batch = writeBatch(db);
            }
        }

        // Commit any remaining operations in the last batch
        if (products.length % BATCH_SIZE !== 0) {
            await batch.commit();
        }

        alert('Products imported successfully!');
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'block', marginBottom: '10px' }}
            />
            <Button variant="contained" component="label">
                Upload CSV
                <input type="file" hidden onChange={handleFileChange} />
            </Button>
        </div>
    );
};

export default ImportProductsCSV;
