import { useState } from "react";


export default function Adminpage() {
  const [votes, setVotes] = useState([
    { id: 1, name: "John Doe", voteCount: 120 },
    { id: 2, name: "Jane Smith", voteCount: 90 },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Quick Count Pemilihan</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {votes.map((candidate) => (
          <div key={candidate.id} className="flex justify-between py-2 border-b">
            <span className="font-medium">{candidate.name}</span>
            <span className="font-bold">{candidate.voteCount} Suara</span>
          </div>
        ))}
      </div>
    </div>
  );
}
