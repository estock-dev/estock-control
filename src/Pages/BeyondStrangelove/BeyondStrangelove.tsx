import { useDispatch } from 'react-redux';
import { deleteAllProducts } from '../../ReduxStore/Slices/productsSlice';
import { AppDispatch } from '../../ReduxStore/store'; // Adjust this path to where your store or AppDispatch type is defined
import './BeyondStrangelove.css';

export default function BeyondStrangelove() {
    // Use AppDispatch type for dispatch if defined
    const dispatch = useDispatch<AppDispatch>();

    const handleDeleteAll = () => {
        // Properly dispatching a thunk action
        dispatch(deleteAllProducts());
    };

    return (
        <>
            <div style={{ textAlign: "center", marginTop: 0, marginBottom: "auto", padding: 0 }}>
                <h3>
                    Se você está aqui, é porque sabe o que vai acontecer se apertar o botão abaixo.
                </h3>
                <h2>
                    Uma vez pressionado, não há volta.
                </h2>
            </div>
            <div className="beyond-strangelove-container">
                <button className="button" onClick={handleDeleteAll}>
                    <div className="lid">
                        <span className="side top"></span>
                        <span className="side front"></span>
                        <span className="side back"></span>
                        <span className="side left"></span>
                        <span className="side right"></span>
                    </div>
                    <div className="panels">
                        <div className="panel-1">
                            <div className="panel-2">
                                <div className="btn-trigger">
                                    <span className="btn-trigger-1"></span>
                                    <span className="btn-trigger-2"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </>
    );
}
