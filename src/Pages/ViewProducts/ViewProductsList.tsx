import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Configuration/firebase';
import { useNavigate } from 'react-router-dom';
import ImportProductsCSV from '../../Configuration/CsvImport';
import { Table, Button, Typography, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import './ViewProductsList.css';

interface Product {
  key: React.Key;
  marca: string;
  modelo: string;
  nome: string;
  qtd: number;
}

const ViewProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map((docSnapshot) => ({
        key: docSnapshot.id,
        ...docSnapshot.data(),
      }) as Product));
    };

    fetchProducts();
  }, []);

  const handleEdit = (id: React.Key) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async (id: React.Key) => {
    await deleteDoc(doc(db, 'products', id.toString()));
    setProducts(products.filter((product) => product.key !== id));
  };

  const handleMultipleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete these products?");
    if (confirmDelete) {
      const deletePromises = selectedRowKeys.map((key) => {
        return deleteDoc(doc(db, 'products', key.toString()));
      });
      await Promise.all(deletePromises);
      setProducts(products.filter(product => !selectedRowKeys.includes(product.key)));
      setSelectedRowKeys([]);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'MARCA',
      dataIndex: 'marca',
      key: 'marca',
      sorter: (a, b) => a.marca.localeCompare(b.marca),
      filterMultiple: false,
      onFilter: (value, record) => record.marca.includes(value as string),
      filters: [...new Set(products.map((item) => item.marca))].map((marca) => ({
        text: marca,
        value: marca,
      })),
    },
    {
      title: 'MODELO',
      dataIndex: 'modelo',
      key: 'modelo',
      sorter: (a, b) => a.modelo.localeCompare(b.modelo),
      filterMultiple: false,
      onFilter: (value, record) => record.modelo.includes(value as string),
      filters: [...new Set(products.map((item) => item.modelo))].map((modelo) => ({
        text: modelo,
        value: modelo,
      })),
    },
    {
      title: 'NOME',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      filterMultiple: false,
      onFilter: (value, record) => record.nome.includes(value as string),
      filters: [...new Set(products.map((item) => item.nome))].map((nome) => ({
        text: nome,
        value: nome,
      })),
    },
    {
      title: 'QTD',
      dataIndex: 'qtd',
      key: 'qtd',
      sorter: (a, b) => a.qtd - b.qtd,
      filterMultiple: false,
      onFilter: (value, record) => record.qtd === Number(value),
    },
    {
      title: ' ',
      key: 'action',
      render: (_, record: Product) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record.key)} icon={<EditOutlined />} />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="view-products-list">
      <Typography.Title level={2} className="title">
        Consultar Estoque
      </Typography.Title>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={products}
        pagination={{
          pageSize: pageSize,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
        }}
        className="customTable"
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
        <Button
          onClick={handleMultipleDelete}
          danger
          disabled={selectedRowKeys.length === 0}
          style={{ marginRight: 8 }}
        >
          Delete selected
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
        >
          Import CSV
        </Button>
      </div>

      <ImportProductsCSV ref={fileInputRef} />
    </div>
  );
};

export default ViewProductsList;