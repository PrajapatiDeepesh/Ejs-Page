const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const port = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse the incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// MQTT Client Setup
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com'); // Replace with your broker URL

mqttClient.on('connect', () => {
    console.log('MQTT connected');
    // Optionally subscribe to a topic
    mqttClient.subscribe('chart/data');
});

mqttClient.on('message', (topic, message) => {
    if (topic === 'chart/data') {
        // Process message data
        // Here you can update the data as needed or store it in a variable
    }
});

// Sample navigation links
const navLinks = [
  { name: 'Home', url: '/' },
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Reports', url: '/reports' },
  { name: 'Settings', url: '/settings' }
];

// Sample grid data
let gridData = [
    { id: 1, name: 'John Doe', age: 28, role: 'Developer' },
    { id: 2, name: 'Jane Smith', age: 34, role: 'Designer' },
    { id: 3, name: 'Sam Johnson', age: 45, role: 'Manager' },
    { id: 4, name: 'Chris Lee', age: 23, role: 'Intern' }
];

// Route for the Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        navLinks: navLinks,
        gridData: gridData
    });
});

// API route to return random bar chart data
app.get('/api/chart-data', (req, res) => {
    // Generate random data for the chart
    const chartData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1);
    res.json(chartData);
});

// Route to handle form submission
app.post('/add-entry', (req, res) => {
    const newEntry = {
        id: parseInt(req.body.id),
        name: req.body.name,
        age: parseInt(req.body.age),
        role: req.body.role
    };
    gridData.push(newEntry);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});
