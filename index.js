const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Social Media Task server is running')
})

app.listen(port, () => {
    console.log(`Social Media Task server running on ${port}`);
})