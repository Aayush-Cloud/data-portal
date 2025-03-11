const Influx = require('influx');

const influxdb = new Influx.InfluxDB({
    host: process.env.INFLUX_URL || 'localhost',
    port: 8086,
    database: process.env.INFLUX_DATABASE || 'FestoCPLab'
});

module.exports = { influxdb };