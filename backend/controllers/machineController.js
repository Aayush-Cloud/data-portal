const Machine = require('../models/Machine');

exports.getMachines = async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMachineById = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        res.json(machine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMachine = async (req, res) => {
    try {
        const machine = new Machine(req.body);
        
        // Ensure we calculate OEE before saving
        machine.calculateOEE();
        machine.calculateHealthStatus();
        
        const newMachine = await machine.save();
        res.status(201).json(newMachine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found' });
        }

        const editableFields = [
            'name', 'description', 'type', 'automationProject',
            'status', 'plannedProductionTime', 'operatingTime',
            'idealCycleTime', 'idealOutputRate'
        ];

        editableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                machine[field] = req.body[field];
            }
        });
        
        const updatedMachine = await machine.save();
        res.json(updatedMachine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        await machine.deleteOne(); // Updated from remove() to deleteOne()
        res.json({ message: 'Machine deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};