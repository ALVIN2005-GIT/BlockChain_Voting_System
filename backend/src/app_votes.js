const express = require("express");
const cors = require("cors");
const voteRoutes = require("./vote");

const app = express();
app.use(express.json());
app.use(cors());

// **Gunakan route yang sudah dideklarasikan di vote.js**
app.use("/api", voteRoutes);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
