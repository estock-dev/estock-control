import StockManagement from '../StockManagement/StockManagement';
import Title from '../../Root/Title/Title';

const StockManagementContainer = () => {
  return (
    <div style={{ minHeight: 360, minWidth: '320px', border: " 1px, solid, red" }}>
      <Title text='Gerenciar Estoque' />
      <div>
        <StockManagement />
      </div>
    </div>
  );
};

export default StockManagementContainer;
