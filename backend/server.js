const express = require('express');
const Influx = require('influx');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 3001;

// Time ranges for historical data
const timeRanges = {
    festoCPLab: {
        start: 1553254518,
        end: 1553256892
    },
    xdkdb: {
        start: 1594980494190, // Updated to match XDK data timestamps
        end: 1594980494261
    }
};

// Configure InfluxDB connections
const influx = new Influx.InfluxDB({
    host: process.env.INFLUXDB_HOST || 'localhost',
    port: process.env.INFLUXDB_PORT || 8086,
    database: 'FestoCPLab'
});

const influxXDK = new Influx.InfluxDB({
    host: process.env.INFLUXDB_HOST || 'localhost',
    port: process.env.INFLUXDB_PORT || 8086,
    database: 'XDKDB'
});

// Debug helper with database selection
const debugQuery = async (measurement, query, database = 'FestoCPLab') => {
    try {
        console.log(`Executing query for ${measurement}:`, query);
        const db = database === 'XDKDB' ? influxXDK : influx;
        const result = await db.query(query);
        console.log(`${measurement} result length:`, Array.isArray(result) ? result.length : 'N/A');
        return result;
    } catch (error) {
        console.error(`Error querying ${measurement}:`, error);
        throw error;
    }
};

// Data visualization endpoints
app.get('/api/compressed-air', async (req, res) => {
    try {
        const query = `
            SELECT Flow, Pressure, Module, time 
            FROM CompressedAir 
            WHERE time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            GROUP BY Module 
            ORDER BY time ASC
        `;
        const result = await debugQuery('CompressedAir', query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

// Debug endpoints
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
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/modules/:module/all-data', async (req, res) => {
    try {
        const module = req.params.module;
        const [status, air, conveyor, emergency] = await Promise.all([
            debugQuery('Application', `
                SELECT Active, Error, Ready, Start, time 
                FROM Application 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            debugQuery('CompressedAir', `
                SELECT Flow, Pressure, time 
                FROM CompressedAir 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            debugQuery('Conveyor', `
                SELECT Running, time 
                FROM Conveyor 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            debugQuery('EmergencySwitch', `
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
        res.status(500).json({ error: error.message });
    }
});
// Add this new endpoint for magnetic sensor data
app.get('/api/magnetic-data', async (req, res) => {
    try {
        const query = `
            SELECT x, y, z, device, time 
            FROM XDKSensorsMag 
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            GROUP BY device 
            ORDER BY time ASC
        `;
        const result = await debugQuery('XDKSensorsMag', query, 'XDKDB');
        res.json(result);
    } catch (error) {
        console.error('Magnetic data error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add this new endpoint for conveyor status
app.get('/api/conveyor-status', async (req, res) => {
    try {
        const query = `
            SELECT Running, Module, time 
            FROM Conveyor 
            WHERE time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            GROUP BY Module 
            ORDER BY time ASC
        `;
        const result = await debugQuery('Conveyor', query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this new endpoint for emergency switch status
app.get('/api/emergency-status', async (req, res) => {
    try {
        const query = `
            SELECT Pressed, Module, time 
            FROM EmergencySwitch 
            WHERE time >= ${timeRanges.festoCPLab.start}s 
            AND time <= ${timeRanges.festoCPLab.end}s 
            GROUP BY Module 
            ORDER BY time ASC
        `;
        const result = await debugQuery('EmergencySwitch', query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Backend routes to add
app.get('/api/xdk-sensors/light', async (req, res) => {
    try {
        const query = `
            SELECT LIGHT, device, time
            FROM XDKSensors
            WHERE time >= ${timeRanges.xdkdb.start}000000 
            AND time <= ${timeRanges.xdkdb.end}000000 
            GROUP BY device
            ORDER BY time ASC
        `;
        const result = await debugQuery('XDKSensors', query, 'XDKDB');
        res.json(result);
    } catch (error) {
        console.error('Light sensor error:', error);
        res.status(500).json({ error: error.message });
    }
});
  


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
app.get('/api/modules/:module', async (req, res) => {
    try {
        const module = req.params.module;
        const [status, air, conveyor, emergency] = await Promise.all([
            debugQuery('Application', `
                SELECT Active, Error, Ready, Start, "Current Step", "Error Message", time 
                FROM Application 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            debugQuery('CompressedAir', `
                SELECT Flow, Pressure, time 
                FROM CompressedAir 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            debugQuery('Conveyor', `
                SELECT Running, time 
                FROM Conveyor 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `),
            debugQuery('EmergencySwitch', `
                SELECT Pressed, time 
                FROM EmergencySwitch 
                WHERE Module = '${module}'
                AND time >= ${timeRanges.festoCPLab.start}s 
                AND time <= ${timeRanges.festoCPLab.end}s 
                ORDER BY time ASC
            `)
        ]);

        res.json({
            moduleName: module,
            data: {
                status,
                compressedAir: air,
                conveyor,
                emergency,
                timestamp: Date.now()
            }
        });
    } catch (error) {
        console.error('Module data error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Start server
// Update the server startup logging
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('\nModule-specific endpoints:');
    console.log('- GET /api/modules/:module/status');
    console.log('- GET /api/modules/:module/compressed-air');
    console.log('- GET /api/modules/:module/all-data');
    console.log('\nGeneral endpoints:');
    console.log('- GET /api/compressed-air');
    console.log('- GET /api/xdk-sensors');
    console.log('- GET /api/machine-status');
    console.log('- GET /api/rfid-tracking');
    console.log('- GET /api/motion-data');
    console.log('- GET /api/magnetic-data');
    console.log('- GET /api/conveyor-status');
    console.log('- GET /api/emergency-status');
    console.log('\nDebug endpoints:');
    console.log('- GET /api/debug/data-check');
    console.log('- GET /api/debug/motion');
    console.log('\nAvailable modules: Press, Turning');
});