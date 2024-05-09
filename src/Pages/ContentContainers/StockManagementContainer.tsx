import StockManagement from '../StockManagement/StockManagement';
import Title from '../../Root/Title/Title';

const StockManagementContainer = () => {
  return (
    <div style={{ minHeight: 360, minWidth: '320px' }}>
      <Title text='Gerenciar Estoque' />
      <div>
        <StockManagement />
      </div>
    </div>
  );
};

export default StockManagementContainer;
