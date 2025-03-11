const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Influx = require('influx');
const dotenv = require('dotenv');
const User = require('./models/User');
const Machine = require('./models/Machine');
const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');
const mcache = require('memory-cache');

dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const port = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oee-portal';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Time ranges for historical data
const timeRanges = {
    festoCPLab: { start: 1553254518, end: 1553256892 },
    xdkdb: { start: 1594980494190, end: 1594980494261 }
};

// InfluxDB Configuration
const influx = new Influx.InfluxDB({
    host: process.env.INFLUXDB_HOST || 'localhost',
    port: process.env.INFLUXDB_PORT || 8086,
    database: process.env.INFLUXDB_DATABASE || 'FestoCPLab',
    username: process.env.INFLUXDB_USERNAME,
    password: process.env.INFLUXDB_PASSWORD
});

const influxXDK = new Influx.InfluxDB({
    host: process.env.INFLUXDB_HOST || 'localhost',
    port: process.env.INFLUXDB_PORT || 8086,
    database: 'XDKDB',
    username: process.env.INFLUXDB_USERNAME,
    password: process.env.INFLUXDB_PASSWORD
});

// Debug helper with database selection
const debugQuery = async (measurement, query, database = 'FestoCPLab') => {
    try {
        console.log(`[DEBUG] Executing query for ${measurement}:`, query);
        const db = database === 'XDKDB' ? influxXDK : influx;
        const result = await db.query(query);
        console.log(`[DEBUG] ${measurement} result length:`, Array.isArray(result) ? result.length : 'N/A');
        return result;
    } catch (error) {
        console.error(`[ERROR] Query failed for ${measurement}:`, error);
        throw error;
    }
};

// Use Authentication & Machine Routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);

// Module-specific endpoints
app.get('/api/modules/:module/status', async (req, res) => {
    try {
        const module = req.params.module;
        const query = `
            SELECT Active, Error, Ready, Start, time 
            FROM Application 
            WHERE Module = '${module}'
            AND time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            ORDER BY time ASC
        `;
        const result = await debugQuery('Application', query);
        res.json(result);
    } catch (error) {
        console.error('Module status error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/modules/:module/compressed-air', async (req, res) => {
    try {
        const module = req.params.module;
        const query = `
            SELECT Flow, Pressure, time 
            FROM CompressedAir 
            WHERE Module = '${module}'
            AND time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            ORDER BY time ASC
        `;
        const result = await debugQuery('CompressedAir', query);
        res.json(result);
    } catch (error) {
        console.error('Compressed air error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/modules/:module/all-data', async (req, res) => {
    try {
        const module = req.params.module;
        const [status, air, conveyor, emergency] = await Promise.all([
            influx.query(`
                SELECT Active, Error, Ready, Start, time 
                FROM Application 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            influx.query(`
                SELECT Flow, Pressure, time 
                FROM CompressedAir 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            influx.query(`
                SELECT Running, time 
                FROM Conveyor 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            influx.query(`
                SELECT Pressed, time 
                FROM EmergencySwitch 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `)
        ]);

        res.json({
            module,
            status,
            compressedAir: air,
            conveyor,
            emergency
        });
    } catch (error) {
        console.error('Module all-data error:', error);
        res.status(500).json({ error: error.message });
    }
});

// XDK Sensors endpoint
app.get('/api/xdk-sensors', async (req, res) => {
    try {
        const query = `
            SELECT HUMIDITY, LIGHT, PRESSURE, TEMP, device, time 
            FROM XDKSensors 
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            GROUP BY device 
            ORDER BY time ASC
        `;
        const result = await debugQuery('XDKSensors', query, 'XDKDB');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// RFID Tracking endpoint
app.get('/api/rfid-tracking', async (req, res) => {
    try {
        const query = `
            SELECT Code, CarrierID, time 
            FROM RfidData 
            WHERE time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            ORDER BY time ASC
        `;
        const result = await debugQuery('RfidData', query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Motion Data endpoint
app.get('/api/motion-data', async (req, res) => {
    try {
        const accQuery = `
            SELECT x, y, z, device, time 
            FROM XDKSensorsAcc 
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            ORDER BY time ASC
        `;
        
        const gyrQuery = `
            SELECT x, y, z, device, time 
            FROM XDKSensorsGyr 
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            ORDER BY time ASC
        `;

        const [accData, gyrData] = await Promise.all([
            debugQuery('XDKSensorsAcc', accQuery, 'XDKDB'),
            debugQuery('XDKSensorsGyr', gyrQuery, 'XDKDB')
        ]);

        res.json({
            acceleration: accData || [],
            gyroscope: gyrData || []
        });
    } catch (error) {
        console.error('Motion data error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Debug Data Check endpoint
app.get('/api/debug/data-check', async (req, res) => {
    try {
        const [festoMeasurements, xdkMeasurements] = await Promise.all([
            influx.getMeasurements(),
            influxXDK.getMeasurements()
        ]);

        const dataCheck = {
            databases: ['FestoCPLab', 'XDKDB'],
            measurements: {
                FestoCPLab: festoMeasurements,
                XDKDB: xdkMeasurements
            },
            timeRanges,
            sampleData: {}
        };

        for (const measurement of festoMeasurements) {
            const query = `SELECT * FROM ${measurement} LIMIT 1`;
            dataCheck.sampleData[measurement] = await debugQuery(measurement, query);
        }

        res.json(dataCheck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug Motion endpoint
app.get('/api/debug/motion', async (req, res) => {
    try {
        const query = `
            SELECT * FROM XDKSensorsAcc 
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            LIMIT 5
        `;
        const result = await debugQuery('XDKSensorsAcc', query, 'XDKDB');
        res.json({
            sampleData: result,
            timeRange: {
                start: timeRanges.xdkdb.start,
                end: timeRanges.xdkdb.end
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update the light sensor endpoint
app.get('/api/xdk-sensors/light', async (req, res) => {
    try {
        const query = `
            SELECT LIGHT, time, device
            FROM XDKSensors
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            ORDER BY time ASC
        `;
        const result = await debugQuery('XDKSensors', query, 'XDKDB');
        console.log('Light sensor data count:', result.length);
        res.json(result);
    } catch (error) {
        console.error('Light sensor error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add magnetic sensor endpoint
app.get('/api/magnetic-data', async (req, res) => {
    try {
        const query = `
            SELECT x, y, z, time, device
            FROM XDKSensorsMag
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            ORDER BY time ASC
        `;
        const result = await debugQuery('XDKSensorsMag', query, 'XDKDB');
        console.log('Magnetic sensor data count:', result.length);
        res.json(result);
    } catch (error) {
        console.error('Magnetic sensor error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Machine Status endpoint
app.get('/api/machine-status', async (req, res) => {
    try {
        const query = `
            SELECT Active, Error, Ready, Start, Module, time 
            FROM Application 
            WHERE time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            GROUP BY Module 
            ORDER BY time ASC
        `;
        const result = await debugQuery('Application', query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        port: port,
        timestamp: Date.now(),
        databases: {
            mongodb: mongoose.connection.readyState === 1,
            influxdb: true
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Add database connection verification
Promise.all([
    mongoose.connection.readyState === 1,
    influx.getDatabaseNames(),
    influxXDK.getDatabaseNames()
]).then(([mongoConnected, festoDBs, xdkDBs]) => {
    console.log('✅ All database connections verified');
    console.log(`MongoDB: ${mongoConnected ? 'Connected' : 'Disconnected'}`);
    console.log('InfluxDB databases:', { FestoCPLab: festoDBs, XDKDB: xdkDBs });
}).catch(err => {
    console.error('❌ Database connection error:', err);
});

// Start server
const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`Module status: http://localhost:${port}/api/modules/Press/status`);
});

module.exports = { app, server, influx, influxXDK };