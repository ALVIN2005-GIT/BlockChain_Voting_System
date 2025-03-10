import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './vontes.css';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      navigate("/admin"); // Pindah ke halaman admin
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Login Admin</h2>
      <form className="bg-white p-6 rounded-lg shadow-lg w-80" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
