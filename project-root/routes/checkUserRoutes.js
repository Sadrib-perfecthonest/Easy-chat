const express = require('express');
const router = express.Router();
const User = require('../models/User'); 


router.post('/check-user', async (req, res) => {
    const { username } = req.body;

    try {
        
        const user = await User.findOne({ username });
        
        if (user) {
            
            return res.status(200).json({
                exists: true,
                avatar: user.profilePic || 'path/to/default/avatar.png', 
                message: 'User found!' 
            });
        } else {
            
            return res.status(404).json({
                exists: false,
                message: 'User is not available in this EasyChat app.' 
            });
        }
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'An error occurred while checking the user.' 
        });
    }
});

module.exports = router;
