import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";

export default function Home() {
    const navigate = useNavigate(); 

    return (
        <div className="container2">
            <h3>Hello...(:</h3>
            <h2>Time to organize your life</h2>
            <button onClick={() => navigate("/listpage")}>
                Get Started
            </button>
        </div>
    )
}

