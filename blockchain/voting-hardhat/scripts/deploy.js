const fs = require("fs");

async function main() {
  console.log("📌 Mulai proses deployment...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  console.log("📌 Berhasil mendapatkan contract factory...");

  const voting = await Voting.deploy();
  console.log("📌 Contract sedang dideploy...");

  await voting.deployed();
  const contractAddress = voting.address;
  console.log("✅ Contract berhasil dideploy ke:", contractAddress);

  // Simpan alamat ke file
  fs.writeFileSync("./deployedAddress.json", JSON.stringify({ contractAddress }, null, 2));
  console.log("📌 Alamat kontrak tersimpan di deployedAddress.json");
}

main().catch((error) => {
  console.error("❌ Error saat deployment:", error);
  process.exitCode = 1;
});
