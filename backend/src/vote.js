require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const router = express.Router();
router.use(express.json());
router.use(cors());

const contractAddress = "0xB581C9264f59BF0289fA76D61B2D0746dCE3C30D";
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "vision",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "mission",
          "type": "string"
        }
      ],
      "name": "CandidateAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "candidateId",
          "type": "uint256"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_vision",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_mission",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "vision",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "mission",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "candidatesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateId",
          "type": "uint256"
        }
      ],
      "name": "getCandidate",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetVotes",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateId",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// **Endpoint Menambahkan Kandidat ke Smart Contract**
router.post('/addCandidate', async (req, res) => {
    try {
        const { candidate_name, vision, mission } = req.body;
        if (!candidate_name || !vision || !mission) {
            return res.status(400).json({ error: "Semua field harus diisi" });
        }

        // Memanggil smart contract untuk menambahkan kandidat
        const tx = await contract.addCandidate(candidate_name, vision, mission);
        await tx.wait(); // Tunggu transaksi selesai

        res.status(201).json({ message: "Kandidat berhasil ditambahkan ke blockchain!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// **Endpoint Mendapatkan Daftar Kandidat**
router.get("/candidates", async (req, res) => {
    try {
        const totalCandidates = await contract.candidatesCount();
        const results = [];
        for (let i = 0; i < totalCandidates; i++) {
            const [name, vision, mission, voteCount] = await contract.getCandidate(i);
            results.push({ id: i, name, vision, mission, voteCount: voteCount.toString() });
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Endpoint Voting**
router.post("/vote", async (req, res) => {
    try {
        const { candidateId } = req.body;
        const tx = await contract.vote(candidateId);
        await tx.wait();
        res.json({ message: "Voting berhasil!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Endpoint Hasil Voting**
router.get("/results", async (req, res) => {
    try {
        const totalCandidates = await contract.candidatesCount();
        const results = [];
        for (let i = 0; i < totalCandidates; i++) {
            const [name, , , voteCount] = await contract.getCandidate(i);
            results.push({ name, voteCount: voteCount.toString() });
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// **Endpoint Reset Voting**
router.post("/reset", async (req, res) => {
    try {
        const tx = await contract.resetVotes();
        await tx.wait();
        res.json({ message: "Voting berhasil di-reset!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;  // **Pastikan export router**
