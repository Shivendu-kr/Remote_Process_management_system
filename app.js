
//00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
const express = require('express');
const { Client } = require('ssh2');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// SSH connection parameters
const sshConfig = {
  host: 'Your_remote_host_ip_address',
  port: 22,
  username: 'Your_remote_host_name',
  privateKey: require('fs').readFileSync('Your_remote_host_access_key'),
};

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017';

// Abnormal thresholds
const CPU_THRESHOLD_PERCENTAGE = 80;
const MEMORY_THRESHOLD_PERCENTAGE = 80;

// Function to execute commands on the EC2 instance and insert data into MongoDB
function fetchDataAndInsertToDB(callback) {
  const conn = new Client();
  conn.on('ready', () => {
    conn.exec('top -bn1 && free -m', (err, stream) => {
      if (err) throw err;
      let data = '';
      stream
        .on('data', chunk => {
          data += chunk.toString();
        })
        .on('close', () => {
          conn.end();
          // Call the callback function with data received from SSH
          callback(data);
        });
    });
  }).connect(sshConfig);
}

// Function to insert or update data in MongoDB
async function insertOrUpdateData(collectionName, data) {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const database = client.db('tasklistDB101');
    const collection = database.collection(collectionName);
    const existingData = await collection.findOne();
    if (existingData) {
      await collection.updateOne({}, { $set: { data, timestamp: new Date() } });
      console.log('Data updated in MongoDB successfully.');
    } else {
      await collection.insertOne({ data, timestamp: new Date() });
      console.log('Data inserted into MongoDB successfully.');
    }
  } catch (error) {
    console.error('Error inserting or updating data in MongoDB:', error);
  } finally {
    await client.close();
  }
}
let cpuUsageValue = null;
let cpuMemoryValue = null;
// Function to fetch data, process it, and display the dashboard
function fetchDataAndDisplayDashboard(req, res) {
  // Fetch the latest data from MongoDB and render the dashboard
  fetchDataAndInsertToDB(data => {
    insertOrUpdateData('system_data', data);

    // Parsing data to check for abnormal patterns
    const lines = data.split('\n');
    const cpuLine = lines.find(line => line.startsWith('%Cpu'));
    const memoryLine = lines.find(line => line.startsWith('Mem:'));

    // Check if CPU usage exceeds threshold
    if (cpuLine) {
      const cpuUsage = parseFloat(cpuLine.split(',')[0].split(':')[1]);
      cpuUsageValue = cpuUsage; 
      if (cpuUsage > CPU_THRESHOLD_PERCENTAGE) {
        console.error('CPU usage is abnormal:', cpuUsage);
        // Log a message for the corrective action
        console.log('Taking corrective action: Stopping the monitored application...');
      }
    }

    // Check if memory usage exceeds threshold
    if (memoryLine) {
      const memoryUsage = parseFloat(memoryLine.split(/\s+/)[2]) / parseFloat(memoryLine.split(/\s+/)[1]) * 100;
      cpuMemoryValue =  memoryUsage; 
      if (memoryUsage > MEMORY_THRESHOLD_PERCENTAGE) {
        console.error('Memory usage is abnormal:', memoryUsage);
        // Log a message for the corrective action
        console.log('Taking corrective action: Stopping the monitored application...');
      }
    }

    // Rendering data to the dashboard
    res.render('dashboard', { cpuLine, memoryLine });
  });
}

// Set up Express routes
app.set('view engine', 'ejs');

// Route to display the dashboard
app.get('/', fetchDataAndDisplayDashboard);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to fetch data and insert into MongoDB every 3 seconds
setInterval(() => {
  fetchDataAndInsertToDB((data) => {
    const cpuUsage = fetchDataAndDisplayDashboard.cpuUsage
    console.log("Data updated in MongoDB.");
    console.log("Your Cpu usage is",cpuUsageValue);
    console.log("Your Memory usage is",cpuMemoryValue);
  });
}, 5000);
