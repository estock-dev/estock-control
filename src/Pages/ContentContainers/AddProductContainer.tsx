import AddProduct from '../AddProducts/AddProduct';
import Title from '../../Root/Title/Title';

const AddProductContainer = () => {
  return (
    <div style={{ minHeight: 360, minWidth: '320px', border: " 1px, solid, red" }}>
      <Title text='Adicionar Produto' />
      <div>
        <AddProduct />
      </div>
    </div>
  );
};

export default AddProductContainer;
