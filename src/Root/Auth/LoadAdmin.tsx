import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
export default function LoadAdmin() {

    const [isAdminRequested, setIsAdminRequested] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        isAdminRequested && navigate('/admin')
    }, [isAdminRequested])

    const handleButtonClick = () => {
        setIsAdminRequested(true);
    }
    return (
        <div>
            <button onClick={handleButtonClick}></button>

        </div>
    )
}
