import { useEffect, useState } from "react";
import axios from "axios";
import './vontes.css';

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    // Fetch daftar kandidat dari backend
    axios.get("http://localhost:5000/api/candidates")
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error("Gagal mengambil data kandidat:", error);
      });
  }, []);

  const handleVote = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/api/vote", { candidateId: id });
      setSelectedCandidate(id);
      alert(response.data.message);
    } catch (error) {
      console.error("Gagal melakukan voting:", error);
      alert("Voting gagal! Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Pemilihan Ketua HIMA TI</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.length === 0 ? (
          <p>Loading data kandidat...</p>
        ) : (
          candidates.map(candidate => (
            <div key={candidate.id} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <img src={candidate.image} alt={candidate.name} className="w-32 h-32 mx-auto rounded-full mb-4" />
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-gray-600"><strong>Visi:</strong> {candidate.vision}</p>
              <p className="text-gray-600"><strong>Misi:</strong> {candidate.mission}</p>
              <button
                onClick={() => handleVote(candidate.id)}
                className={`mt-4 px-4 py-2 text-white rounded-lg ${
                  selectedCandidate === candidate.id ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {selectedCandidate === candidate.id ? "Terpilih" : "Pilih"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
