import React, { forwardRef } from 'react';
import Papa from 'papaparse';
import { collection, doc } from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';
import { db } from '../Configuration/firebase';
// import { Button } from '@mui/material';

const ImportProductsCSV = forwardRef<HTMLInputElement>((props, ref) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    uploadProducts(result.data as { marca: string; modelo: string; nome: string; qtd: number; }[]);
                },
                header: true,
                skipEmptyLines: true,
            });
        }
    };

    const uploadProducts = async (products: { marca: string; modelo: string; nome: string; qtd: number; }[]) => {
        const collectionRef = collection(db, 'products');
        let batch = writeBatch(db);
        const BATCH_SIZE = 500;

        for (let i = 0; i < products.length; i++) {
            const docRef = doc(collectionRef);
            batch.set(docRef, products[i]);


            if (i % BATCH_SIZE === 0) {
                await batch.commit();
                batch = writeBatch(db);
            }
        }


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
                style={{ display: 'none' }} // Hide the input element
                ref={ref} // Attach the forwarded ref
            />
            {/* The visible button is removed since the file input will be triggered elsewhere */}
        </div>
    );
});

export default ImportProductsCSV;
