const express = require('express');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/books', bookRoutes);

// Error handler (ต้องอยู่ล่างสุด)
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
