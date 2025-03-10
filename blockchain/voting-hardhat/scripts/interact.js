const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3 "; // Ganti dengan alamat kontrak terbaru
  const Voting = await ethers.getContractFactory("Voting");
  const voting = Voting.attach(contractAddress);

  console.log("📌 Menghubungkan ke kontrak di:", contractAddress);

  // Tambahkan kandidat
  const tx1 = await voting.addCandidate("Alice");
  await tx1.wait();
  console.log("✅ Kandidat 'Alice' ditambahkan!");

  const tx2 = await voting.addCandidate("Bob");
  await tx2.wait();
  console.log("✅ Kandidat 'Bob' ditambahkan!");

  // Ambil jumlah kandidat
  const totalCandidates = await voting.candidatesCount();
  console.log(`📌 Jumlah total kandidat: ${totalCandidates.toString()}`);

  // Lihat daftar kandidat
  for (let i = 0; i < totalCandidates; i++) {
    const [name, voteCount] = await voting.getCandidate(i);
    console.log(`🗳 Kandidat ${i}: ${name}, Suara: ${voteCount.toString()}`);
  }

  // Simulasi voting
  const voteTx = await voting.vote(0); // Vote untuk kandidat pertama (Alice)
  await voteTx.wait();
  console.log("✅ Berhasil memberikan suara untuk kandidat pertama!");

  // Cek hasil voting setelah pemungutan suara
  const [updatedName, updatedVoteCount] = await voting.getCandidate(0);
  console.log(`📊 Hasil akhir: ${updatedName}, Suara: ${updatedVoteCount.toString()}`);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
