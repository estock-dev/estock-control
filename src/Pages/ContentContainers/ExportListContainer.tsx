import ListExport from '../ListExport/ListExport';
import Title from '../../Root/Title/Title';

const ExportlistContainer = () => {
  return (
    <div style={{ minHeight: 360, minWidth: '320px', border: " 1px, solid, red" }}>
      <Title text='Listas' />
      <div>
        <ListExport/>
      </div>
    </div>
  );
};

export default ExportlistContainer;
