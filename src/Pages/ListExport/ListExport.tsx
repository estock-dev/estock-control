import React, { useState } from 'react';
import { Button, Input, Switch } from 'antd';
import { useAppSelector } from '../../ReduxStore/hooks';
import ProductSelectorListExport from '../ProductSelector/ProductSelectorListExport';
import { copyToClipboard, convertDataToString,  } from './ListUtility';
import { ProductItem } from './ListUtility';
const { TextArea } = Input;

const ListExport: React.FC = () => {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const [listString, setListString] = useState<string>('');
    const [includeQuantity, setIncludeQuantity] = useState<boolean>(false); // State for the switch

    const products = useAppSelector(state => state.products.products);

    const updateListString = (productList: ProductItem[]) => {
        const newString = convertDataToString(productList, includeQuantity);
        setListString(newString);
        return newString;
    };

    const handleExportAll = () => {
        const productListString = updateListString(products);
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

        const productListString = updateListString(filteredProducts);
        copyToClipboard(productListString);
    };

    const handleSelectionChange = (brands: string[] | null, models: string[] | null, names: string[] | null) => {
        setSelectedBrands(brands || []);
        setSelectedModels(models || []);
        setSelectedNames(names || []);

        let filteredProducts = products;

        if (brands && brands.length) {
            filteredProducts = filteredProducts.filter(p => brands.includes(p.marca));
        }

        if (models && models.length) {
            filteredProducts = filteredProducts.filter(p => models.includes(p.modelo));
        }

        if (names && names.length) {
            filteredProducts = filteredProducts.filter(p => names.includes(p.nome));
        }

        updateListString(filteredProducts);
    };

    return (
        <div className='view-products-list'>
            <ProductSelectorListExport
                onSelectionChange={handleSelectionChange}
            />
            <div className="buttonGroup">
                <Switch
                    checkedChildren="Incluir Quantidade"
                    unCheckedChildren="Não Incluir quantidade"
                    onChange={setIncludeQuantity}
                    defaultChecked={includeQuantity}
                />
                <Button onClick={handleExportSelected}>
                    Exportar Seleção
                </Button>
                <Button onClick={handleExportAll}>
                    Exportar Lista Completa
                </Button>
            </div>
            <TextArea
                value={listString}
                readOnly
                style={{ marginTop: 20, minHeight: "200px", display: "flex", flexDirection: "column"  }}
            />
        </div>
    )
}



export default ListExport;
