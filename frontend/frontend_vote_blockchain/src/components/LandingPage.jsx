import { Link } from "react-router-dom";
import './vontes.css';
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 bg-amber-200">Selamat Datang di Pemilihan Ketua HIMA TI</h1>
      <Link to="/login">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600">
          Login
        </button>
      </Link>
    </div>
  );
}
