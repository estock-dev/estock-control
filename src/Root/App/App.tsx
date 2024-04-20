import { RouterProvider } from 'react-router-dom';
import { router } from '../../Routes/Routes'
import './App.css'

function App() {
  return (
    
    <div className='router-container'>
      <RouterProvider router={router} />
    </div>
    
  );
}

export default App;
