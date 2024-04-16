import React, { forwardRef } from 'react';
import Papa from 'papaparse';
import { collection, doc } from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';
import { db } from '../Configuration/firebase';

const ImportProductsCSV = forwardRef<HTMLInputElement>((props, ref) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    const products = result.data as { marca: string; modelo: string; nome: string; qtd: string; }[];
                    uploadProducts(products);
                },
                header: true,
                skipEmptyLines: true,
            });
        }
    };
    

    const uploadProducts = async (products: { marca: string; modelo: string; nome: string; qtd: string; }[]) => {
        const collectionRef = collection(db, 'products');
        let batch = writeBatch(db);
        const BATCH_SIZE = 500;

        for (let i = 0; i < products.length; i++) {
            const product = {
                ...products[i],
                qtd: parseInt(products[i].qtd, 10)
            };
            
            if (!isNaN(product.qtd)) {
                const docRef = doc(collectionRef);
                batch.set(docRef, product);
            } else {
                console.error(`Invalid quantity for product at index ${i}:`, products[i]);
            }

            if ((i + 1) % BATCH_SIZE === 0) {
                await batch.commit();
                batch = writeBatch(db);
            }
        }

        if (products.length % BATCH_SIZE !== 0) {
            await batch.commit();
        }
        console.log(props)
        alert('Products imported successfully!');
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={ref}
            />
        </div>
    );
});

export default ImportProductsCSV;
