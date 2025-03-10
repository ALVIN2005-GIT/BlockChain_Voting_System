const express = require('express');
const pool = require('./db');
const router = express.Router();

/* ======================================
   ✅ CRUD USER
====================================== */


// 🔹 1️⃣ API Tambah User
router.post('/users', async (req, res) => {
  try {
    const { npm, nama } = req.body;

    // Cek apakah user sudah ada
    const existingUser = await pool.query("SELECT * FROM users WHERE npm = $1", [npm]);
    if (existingUser.rows.length > 0) return res.status(400).json({ error: "User sudah terdaftar!" });

    // Pastikan nama dikirim
    if (!nama) return res.status(400).json({ error: "Nama tidak boleh kosong!" });

    // Tambahkan user baru
    await pool.query("INSERT INTO users (npm, nama, status) VALUES ($1, $2, false)", [npm, nama]);

    res.json({ message: `User dengan NPM ${npm} berhasil ditambahkan!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔹 1️⃣ API Cek Daftar User (Otomatis dari Database)
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, npm, nama, status FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 2️⃣ API Hapus User (Manual - Ketik Sendiri)
router.delete('/users/manual', async (req, res) => {
  try {
    const { id } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: `User dengan NPM ${user.rows[0].npm} berhasil dihapus!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 3️⃣ API Hapus User (Otomatis dari Database)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: `User dengan NPM ${user.rows[0].npm} berhasil dihapus!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/manual', async (req, res) => {
  try {
    const { id } = req.params;
    const { npm, status } = req.body; // Semua data bisa diketik manual

    // Periksa apakah user ada
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Update data user secara manual
    await pool.query("UPDATE users SET npm = $1, status = $2 WHERE id = $3", [npm, status, id]);

    res.json({ message: `Data user ${npm} berhasil diperbarui!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    // Periksa apakah user ada
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Update status user secara otomatis (misalnya, setelah voting)
    await pool.query("UPDATE users SET status = true WHERE id = $1", [id]);

    res.json({ message: `Status user ${user.rows[0].npm} diperbarui otomatis menjadi sudah memilih!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



/* ======================================
   ✅ CRUD KANDIDAT
====================================== */

// 🔹 4️⃣ API Tambah Kandidat
router.post('/candidates', async (req, res) => {
  try {
    const { nama, visi, misi } = req.body;
    await pool.query("INSERT INTO candidates (nama, visi, misi, votes) VALUES ($1, $2, $3, 0)", [nama, visi, misi]);
    res.json({ message: "Kandidat berhasil ditambahkan!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 5️⃣ API Cek Daftar Kandidat
router.get('/candidates', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM candidates");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 6️⃣ API Edit Kandidat (Manual - Ketik Sendiri)
router.put('/candidates/manual', async (req, res) => {
  try {
    const { id, nama, visi, misi, votes } = req.body;

    const candidate = await pool.query("SELECT * FROM candidates WHERE id = $1", [id]);
    if (candidate.rows.length === 0) return res.status(404).json({ error: "Kandidat tidak ditemukan" });

    await pool.query(
      "UPDATE candidates SET nama = $1, visi = $2, misi = $3, votes = $4 WHERE id = $5",
      [nama, visi, misi, votes, id]
    );

    res.json({ message: `Kandidat ${nama} berhasil diperbarui!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 7️⃣ API Edit Kandidat (Otomatis dari Database)
router.put('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, visi, misi } = req.body;

    const candidate = await pool.query("SELECT * FROM candidates WHERE id = $1", [id]);
    if (candidate.rows.length === 0) return res.status(404).json({ error: "Kandidat tidak ditemukan" });

    await pool.query("UPDATE candidates SET nama = $1, visi = $2, misi = $3 WHERE id = $4", [nama, visi, misi, id]);

    res.json({ message: `Kandidat ${nama} berhasil diperbarui!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 8️⃣ API Hapus Kandidat (Manual - Ketik Sendiri)
router.delete('/candidates/manual', async (req, res) => {
  try {
    const { id } = req.body;

    const candidate = await pool.query("SELECT * FROM candidates WHERE id = $1", [id]);
    if (candidate.rows.length === 0) return res.status(404).json({ error: "Kandidat tidak ditemukan" });

    await pool.query("DELETE FROM candidates WHERE id = $1", [id]);

    res.json({ message: `Kandidat ${candidate.rows[0].nama} berhasil dihapus!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 9️⃣ API Hapus Kandidat (Otomatis dari Database)
router.delete('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await pool.query("SELECT * FROM candidates WHERE id = $1", [id]);
    if (candidate.rows.length === 0) return res.status(404).json({ error: "Kandidat tidak ditemukan" });

    await pool.query("DELETE FROM candidates WHERE id = $1", [id]);

    res.json({ message: `Kandidat ${candidate.rows[0].nama} berhasil dihapus!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ======================================
   ✅ VOTING SYSTEM
====================================== */

// 🔹 🔟 API Voting
router.post('/vote', async (req, res) => {
  try {
    const { npm, candidate_id } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE npm = $1", [npm]);
    if (user.rows.length === 0) return res.status(400).json({ error: "Mahasiswa tidak ditemukan" });
    if (user.rows[0].status) return res.status(400).json({ error: "Anda sudah memilih!" });

    await pool.query("INSERT INTO votes (user_id, candidate_id) VALUES ($1, $2)", [user.rows[0].id, candidate_id]);
    await pool.query("UPDATE users SET status = true WHERE id = $1", [user.rows[0].id]);
    await pool.query("UPDATE candidates SET votes = votes + 1 WHERE id = $1", [candidate_id]);

    res.json({ message: "Vote berhasil!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 1️⃣1️⃣ API Cek Hasil Voting
router.get('/results', async (req, res) => {
  try {
    const result = await pool.query("SELECT nama, votes FROM candidates ORDER BY votes DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
