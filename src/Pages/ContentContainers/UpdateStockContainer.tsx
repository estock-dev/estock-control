import StockUpdate from '../StockUpdate/StockUpdate';
import Title from '../../Root/Title/Title';

const AddProductContainer = () => {
  return (
    <div style={{ width: "100%", border: "1px solid red", minHeight: 360, minWidth: '320px' }}>
      <Title text='Atualizar Quantidade de um Produto' />
      <div>
        <StockUpdate />
      </div>
    </div>
  );
};

export default AddProductContainer;
