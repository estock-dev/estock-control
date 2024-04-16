import React, { useState } from 'react';
import { Button, message } from 'antd';
import ProductSelector from "../ProductSelector/ProductSelector";
import { useAppSelector } from '../../ReduxStore/hooks';
import { ProductItem } from "../../ReduxStore/Slices/productsSlice";

const ListExport: React.FC = () => {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const products = useAppSelector(state => state.products.products);

    const handleExportAll = () => {
        const productListString = convertDataToString(products);
        copyToClipboard(productListString);
    };

    const handleExportSelected = () => {
        let filteredProducts = products;

        if (selectedBrand) {
            filteredProducts = filteredProducts.filter(p => p.marca === selectedBrand);
        }

        if (selectedModel) {
            filteredProducts = filteredProducts.filter(p => p.modelo === selectedModel);
        }

        if (selectedName) {
            filteredProducts = filteredProducts.filter(p => p.nome === selectedName);
        }

        const productListString = convertDataToString(filteredProducts);
        copyToClipboard(productListString);
    };

    return (
        <div className='view-products-list'>
            <ProductSelector
                onSelectionChange={(brand, model, name) => {
                    setSelectedBrand(brand);
                    setSelectedModel(model);
                    setSelectedName(name);
                }}
                stepByStep={false}
            />
            <div className="buttonGroup">
                <Button onClick={handleExportSelected}>
                    Export Selection
                </Button>
                <Button onClick={handleExportAll}>
                    Export Full List
                </Button>
            </div>
        </div>
    )
}

function convertDataToString(data: ProductItem[]): string {
    // Convert the product data to a string format.
    return data.map(p => `${p.marca}, ${p.modelo}, ${p.nome}, ${p.qtd}`).join('\n');
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        message.success('List copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

export default ListExport;
