const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sequelize = require('./db');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const connectMongo = require('./mongo');
connectMongo();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors()); 
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/doctorservices', require('./routes/doctorServiceRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));



const PORT = process.env.PORT || 3001;
async function start() {
  try {
    await sequelize.sync({ alter: false });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error('Server error', e);
  }
}

start();
