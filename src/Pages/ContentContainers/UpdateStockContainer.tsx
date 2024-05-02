import StockUpdate from '../StockUpdate/StockUpdate';
import Title from '../../Root/Title/Title';

const AddProductContainer = () => {
  return (
    <div style={{ minHeight: 360, minWidth: '320px', border: " 1px, solid, red" }}>
      <Title text='Atualizar Quantidade de um Produto' />
      <div>
        <StockUpdate />
      </div>
    </div>
  );
};

export default AddProductContainer;
