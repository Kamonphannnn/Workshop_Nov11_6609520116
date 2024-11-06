const express = require('express'); 
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
// const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const ACCESS_TOKEN = 'TUa446489ced783d84f0dcf6912b335af7ffec95e1ee07c930d03d8142475b2ee76dd1afa5d3ecde5d2d2c8de394f2e088';

app.post('/login', async (req, res) => {
    const { Username, Password } = req.body;
  
    try {
      const response = await axios.post('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        Username,
        Password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Application-Key': ACCESS_TOKEN
        }
      });
  
      const data = response.data;
  
      if (data.status === true) {
        res.json({
          message: 'Login successful',
          email: data.email,
          username: data.username,
          displayname_en: data.displayname_en,
          faculty: data.faculty
        });
      } else {
        res.status(401).json({
          message: 'Login failed: ' + data.message
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
  });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });