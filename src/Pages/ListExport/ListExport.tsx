import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useAppSelector } from '../../ReduxStore/hooks';
import { ProductItem } from "../../ReduxStore/Slices/productsSlice";
import ProductSelectorListExport from '../ProductSelector/ProductSelectorListExport';

const ListExport: React.FC = () => {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedNames, setSelectedNames] = useState<string[]>([]);
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

        if (selectedBrands.length) {
            filteredProducts = filteredProducts.filter(p => selectedBrands.includes(p.marca));
        }

        if (selectedModels.length) {
            filteredProducts = filteredProducts.filter(p => selectedModels.includes(p.modelo));
        }

        if (selectedNames.length) {
            filteredProducts = filteredProducts.filter(p => selectedNames.includes(p.nome));
        }


        const productListString = convertDataToString(filteredProducts);
        copyToClipboard(productListString);
    };
    
    const handleSelectionChange = (brands: string[] | null, models: string[] | null, names: string[] | null) => {
        setSelectedBrands(brands || []);
        setSelectedModels(models || []);
        setSelectedNames(names || []);
    };

    return (
        <div className='view-products-list'>
            <ProductSelectorListExport
                onSelectionChange={handleSelectionChange}
            />
            <div className="buttonGroup">
                <Button onClick={handleExportSelected}>
                    Exportar Seleção
                </Button>
                <Button onClick={handleExportAll}>
                    Exportar Lista Completa
                </Button>
            </div>
        </div>
    )
}

function convertDataToString(data: ProductItem[]): string {
    return data.map(p => `${p.marca}, ${p.modelo}, ${p.nome}, ${p.qtd}`).join('\n');
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        message.success('Lista copiada para o clipboard!');
    }).catch(err => {
        console.error('s: ', err);
    });
}

export default ListExport;
