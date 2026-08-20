require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const appointments = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  date: { type: String, required: true },
  message: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

let databaseConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => { databaseConnected = true; console.log('Connected to MongoDB'); })
    .catch(err => console.warn('MongoDB unavailable. Using temporary demo storage:', err.message));
} else {
  console.log('No MONGODB_URI found. Using temporary demo storage.');
}

app.get('/api/appointments', async (req, res) => {
  try {
    const data = databaseConnected
      ? await Appointment.find().sort({ createdAt: -1 }).lean()
      : [...appointments].reverse();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Could not load appointments.' });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { name, phone, department, date, message = '' } = req.body;
  if (![name, phone, department, date].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }
  try {
    const entry = { name: name.trim(), phone: phone.trim(), department, date, message: message.trim() };
    const appointment = databaseConnected
      ? await Appointment.create(entry)
      : { ...entry, _id: Date.now().toString(), createdAt: new Date() };
    if (!databaseConnected) appointments.push(appointment);
    res.status(201).json({ message: 'Appointment booked successfully!', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Could not book the appointment.' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`CareConnect running at http://localhost:${PORT}`));
