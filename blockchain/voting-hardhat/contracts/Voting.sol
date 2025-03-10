// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol"; // ✅ Pastikan importnya benar!

contract Voting is Ownable {
    struct Candidate {
        uint id;
        string name;
        string vision;
        string mission;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    address[] public voters; // Tambahkan daftar pemilih

    event CandidateAdded(string name, string vision, string mission);
    event Voted(address voter, uint256 candidateId);

    // ✅ Tambahkan constructor dan teruskan msg.sender ke Ownable
    constructor() Ownable(msg.sender) {}

    function addCandidate(string memory _name, string memory _vision, string memory _mission) public onlyOwner {
        uint id = candidates.length;
        candidates.push(Candidate(id, _name, _vision, _mission, 0));
        emit CandidateAdded(_name, _vision, _mission);
    }

    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted!");
        require(_candidateId < candidates.length, "Invalid candidate!");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        voters.push(msg.sender); // Simpan alamat voter
        emit Voted(msg.sender, _candidateId);
    }

    function getCandidate(uint256 _candidateId) public view returns (string memory, string memory, string memory, uint256) {
        require(_candidateId < candidates.length, "Invalid candidate!");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.vision, candidate.mission, candidate.voteCount);
    }

    function candidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    // ✅ Tambahkan fungsi resetVotes agar hanya pemilik bisa reset voting
    function resetVotes() public onlyOwner {
        for (uint i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        for (uint i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
        }
        delete voters; // Kosongkan daftar voters
    }
}
