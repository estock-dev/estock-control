import NavBar from '../NavBar/NavBar';
import { RouterProvider } from 'react-router-dom';
import { router } from '../../Routes/Routes'

function App() {
  return (
    <>
    <NavBar/>
    <RouterProvider router={router} />
    </>
  );
}

export default App;
