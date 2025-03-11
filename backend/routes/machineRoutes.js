const express = require('express');
const { 
    getMachines, 
    getMachineById, 
    createMachine, 
    updateMachine,
    deleteMachine
} = require('../controllers/machineController');
const authenticateToken = require('../middleware/authMiddleware');
const mcache = require('memory-cache');

const router = express.Router();

// Improved cache middleware with longer duration and error handling
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        
        if (cachedBody) {
            return res.json(cachedBody);
        }

        // Store original send
        res.sendResponse = res.json;
        res.json = (body) => {
            if (body && !body.error) {  // Only cache successful responses
                mcache.put(key, body, duration * 1000);
            }
            res.sendResponse(body);
        };
        next();
    };
};

// Basic CRUD routes with authentication
router.get('/', authenticateToken, cacheMiddleware(30), getMachines);
router.get('/:id', authenticateToken, cacheMiddleware(30), getMachineById);
router.post('/', authenticateToken, createMachine);
router.put('/:id', authenticateToken, updateMachine);
router.delete('/:id', authenticateToken, deleteMachine);

module.exports = router;