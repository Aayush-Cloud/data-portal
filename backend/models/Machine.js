const mongoose = require("mongoose");

const DowntimeEventSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    reason: { type: String, required: true },
});

const ProductionDataSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    totalPieces: { type: Number, default: 0 },
    goodPieces: { type: Number, default: 0 }
});

const MachineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        healthStatus: {
            type: String,
            enum: ["healthy", "unhealthy", "severely unhealthy", "critically unhealthy"],
            default: "healthy",
        },
        type: String,
        automationProject: String,
        status: {
            type: String,
            enum: ["running", "stopped", "maintenance"],
            default: "stopped",
        },

        plannedProductionTime: { type: Number, default: 480 },
        operatingTime: { type: Number, default: 0 },
        idealCycleTime: { type: Number, default: 60 },
        idealOutputRate: { type: Number, default: 60 },

        productionData: [ProductionDataSchema],
        downtimeEvents: [DowntimeEventSchema],

        availability: { type: Number, default: 0 },
        performance: { type: Number, default: 0 },
        quality: { type: Number, default: 0 },
        oee: { type: Number, default: 0 },

        mockDataEnabled: { type: Boolean, default: true }
    },
    { timestamps: true }
);

MachineSchema.methods.calculateOEE = function() {
    const availability = Math.min(100, (this.operatingTime / this.plannedProductionTime) * 100);
    
    const latestProduction = this.productionData[this.productionData.length - 1];
    const actualOutput = latestProduction ? latestProduction.totalPieces : 0;
    const theoreticalOutput = (this.operatingTime / 60) * this.idealOutputRate;
    const performance = Math.min(100, theoreticalOutput > 0 ? (actualOutput / theoreticalOutput) * 100 : 0);
    
    const goodPieces = latestProduction ? latestProduction.goodPieces : 0;
    const totalPieces = latestProduction ? latestProduction.totalPieces : 0;
    const quality = Math.min(100, totalPieces > 0 ? (goodPieces / totalPieces) * 100 : 0);

    this.availability = Math.round(availability);
    this.performance = Math.round(performance);
    this.quality = Math.round(quality);
    this.oee = Math.round((availability * performance * quality) / 10000);

    return this.oee;
};

MachineSchema.methods.calculateHealthStatus = function() {
    if (this.oee >= 70) {
        this.healthStatus = "healthy";
    } else if (this.oee >= 50) {
        this.healthStatus = "unhealthy";
    } else if (this.oee >= 30) {
        this.healthStatus = "severely unhealthy";
    } else {
        this.healthStatus = "critically unhealthy";
    }
};

MachineSchema.pre('save', function(next) {
    // Calculate OEE
    this.calculateOEE();
    // Update health status based on OEE
    this.calculateHealthStatus();
    next();
});

module.exports = mongoose.model('Machine', MachineSchema);