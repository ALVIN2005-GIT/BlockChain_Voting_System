import { useEffect, useState } from "react";
import axios from "axios";
import './vontes.css';
const API_URL = "http://localhost:5000"; // Ganti sesuai backend-mu

function Voting() {
  const [npm, setNpm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);

  // Ambil daftar kandidat dari backend
  useEffect(() => {
    fetchCandidates();
    fetchResults();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidates`);
      setCandidates(res.data);
    } catch (error) {
      console.error("Gagal mengambil kandidat:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/results`);
      setResults(res.data);
    } catch (error) {
      console.error("Gagal mengambil hasil voting:", error);
    }
  };

  const handleVote = async () => {
    if (!npm || !selectedCandidate) {
      setMessage("Harap masukkan NPM dan pilih kandidat!");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/vote`, {
        npm,
        candidate_id: selectedCandidate,
      });

      setMessage(res.data.message);
      fetchResults(); // Update hasil voting setelah sukses
    } catch (error) {
      setMessage(error.response?.data?.error || "Terjadi kesalahan!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Voting HIMA TI</h1>

        {/* Input NPM */}
        <input
          type="text"
          placeholder="Masukkan NPM"
          className="w-full p-2 border rounded mb-4"
          value={npm}
          onChange={(e) => setNpm(e.target.value)}
        />

        {/* Daftar Kandidat */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Pilih Kandidat:</h2>
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center mt-2">
              <input
                type="radio"
                id={`candidate-${candidate.id}`}
                name="candidate"
                value={candidate.id}
                onChange={() => setSelectedCandidate(candidate.id)}
              />
              <label htmlFor={`candidate-${candidate.id}`} className="ml-2">
                {candidate.nama} - {candidate.visi}
              </label>
            </div>
          ))}
        </div>

        {/* Tombol Voting */}
        <button
          onClick={handleVote}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Vote
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>

      {/* Hasil Voting */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Hasil Voting</h2>
        {results.map((candidate, index) => (
          <p key={index} className="text-center">
            {candidate.nama}: {candidate.votes} suara
          </p>
        ))}
      </div>
    </div>
  );
}

export default Voting;
