import { useDispatch } from 'react-redux';
import { deleteAllProducts } from '../../ReduxStore/Slices/productsSlice';
import { AppDispatch } from '../../ReduxStore/store'; // Adjust this path to where your store or AppDispatch type is defined
import { useNavigate } from 'react-router-dom';
import './BeyondStrangelove.css';

export default function BeyondStrangelove() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleDeleteAll = () => {
        dispatch(deleteAllProducts());
        navigate('/bar-and-ball')
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignContent: "center", justifyContent: "center", margin: "auto"}}>
            <div className="beyond-strangelove-container" style={{}}>
                <button className="button" style={{ margin: 300}} onClick={handleDeleteAll}>
                    <div className="lid">
                        <span className="side top"></span>
                        <span className="side front"></span>
                        <span className="side back"></span>
                        <span className="side left"></span>
                        <span className="side right"></span>
                    </div>
                    <div className="panels" >
                        
                            <div className="panel-2">
                                <div className="btn-trigger">
                                    <span className="btn-trigger-1"></span>
                                    <span className="btn-trigger-2"></span>
                                </div>
                            </div>
                        
                    </div>
                </button>
            </div>
        </div>
    );
}
