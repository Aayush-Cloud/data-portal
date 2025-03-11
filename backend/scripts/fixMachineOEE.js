const mongoose = require('mongoose');
const Machine = require('../models/Machine');
require('dotenv').config();

async function fixMachineOEE() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oee-portal');
        console.log('✅ MongoDB connected');
        
        // Get all machines
        const machines = await Machine.find();
        console.log(`Found ${machines.length} machines to fix`);
        
        // Update each machine
        for (const machine of machines) {
            console.log(`Processing machine: ${machine.name}`);
            
            // Original values
            const originalOEE = machine.oee;
            const originalHealth = machine.healthStatus;
            
            // Recalculate OEE and health status
            machine.calculateOEE();
            machine.calculateHealthStatus();
            
            // Log changes
            console.log(`- OEE: ${originalOEE}% → ${machine.oee}%`);
            console.log(`- Health: ${originalHealth} → ${machine.healthStatus}`);
            
            // Save changes
            await machine.save();
        }
        
        console.log('✅ All machines updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating machines:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

fixMachineOEE();