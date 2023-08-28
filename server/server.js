const express = require('express');
const cors = require('cors');
const taskRoutes = require('./Routes/taskRoutes');
const db = require('./Config/db');

const app = express();

app.use(cors()); // Use the 'cors' middleware globally

app.use(express.json());
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
