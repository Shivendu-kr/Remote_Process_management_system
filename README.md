# Remote_Process_management_system
This project is a remote computer process management system developed using Node.js, MongoDB, and a bit of frontend to monitor system backend processes. It automatically saves process information to MongoDB and shuts down any processes exhibiting abnormalities.

# How it Works
The Master system continuously monitors CPU and memory usage of the remote system, saving the metrics to a MongoDB database. If remote system CPU or memory usage exceeds predefined thresholds, the Master system can automatically shuts down the corresponding process.

# Features
Process Monitoring: Constantly monitors remote system backend processes.

Abnormality Detection: Identifies abnormal behavior in remote system processes.

Automatic Shutdown: Automatically shuts down processes with abnormalities.

Database Integration: Stores process information in MongoDB.

# Technologies Used
Node.js: Backend server environment.

MongoDB: NoSQL database for storing process data.

Frontend: Minimal frontend for user interaction.

AWS: For creating remote machine(instance). //you can use your own

# Setup Instructions
Clone the Repository: https://github.com/Shivendu-kr/Remote_Process_management_system.git

# File Architecture
computer-process-management/

│
       ├── config.js                # Configuration file (MongoDB connection, thresholds)
       
       ├──Modules, Package file     # Dependencies files

       ├── app.js                   # The Main file

       ├── key.pem                  # remote system key

│
├── views/                  # Directory for static files (frontend)

      │   └── dashboard.ejs         # Main front-end file



# Install Dependencies:
cd To main file
npm init -y
npm i express child_process mongoose ssh2 mongodb

# Set Up MongoDB:
Run MongoDB server : mongod
To see saved database: cmd mongose --> show dbs --> use tasklistDB101 --> db.tasklistDB101.find()

# Run the app.js
node app.js
# Access the Application:
Open your browser and go to http://localhost:3000. 

# Configuration
MongoDB connection settings can be configured in config.js.
Process monitoring thresholds and other settings can be adjusted in config.js.
# Usage
The master system can automatically monitors remote system CPU and memory usage.
Abnormalities trigger automatic shutdown of corresponding processes.
The frontend displays current system metrics.
# API Endpoints
GET /api/systemMetrics: Retrieves CPU and memory usage metrics.

# 
License
This project is licensed under the MIT License.

# Acknowledgements
Special thanks to Node.js and MongoDB for their powerful platforms.
Thanks to all the online resources that helped improving this project.
