const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Use protect middleware for all routes
router.use(protect);

// Helper function to calculate age
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to check if today is birthday
const isBirthday = (dateOfBirth) => {
  if (!dateOfBirth) return false;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  return today.getMonth() === birthDate.getMonth() && 
         today.getDate() === birthDate.getDate();
};

// Use protect middleware for all routes
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const age = calculateAge(user.dateOfBirth);
    const todayIsBirthday = isBirthday(user.dateOfBirth);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        age: age,
        isBirthday: todayIsBirthday,
        preferences: user.preferences,
        isEmailVerified: user.isEmailVerified,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', async (req, res, next) => {
  try {
    const { name, dateOfBirth } = req.body;
    
    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    
    // Handle dateOfBirth with proper validation
    if (dateOfBirth !== undefined) {
      if (dateOfBirth === null || dateOfBirth === '') {
        updateData.dateOfBirth = null;
      } else {
        const dobDate = new Date(dateOfBirth);
        if (isNaN(dobDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid date of birth format'
          });
        }
        
        // Check if date is not in the future
        if (dobDate > new Date()) {
          return res.status(400).json({
            success: false,
            message: 'Date of birth cannot be in the future'
          });
        }
        
        updateData.dateOfBirth = dobDate;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        age: calculateAge(user.dateOfBirth),
        isBirthday: isBirthday(user.dateOfBirth),
        preferences: user.preferences,
        isEmailVerified: user.isEmailVerified,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
router.put('/avatar', async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', async (req, res, next) => {
  try {
    // Delete user and all associated todos
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Check if today is user's birthday
// @route   GET /api/users/birthday
// @access  Private
router.get('/birthday', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.dateOfBirth) {
      return res.status(200).json({
        success: true,
        isBirthday: false,
        message: 'No date of birth set'
      });
    }
    
    const todayIsBirthday = isBirthday(user.dateOfBirth);
    const age = calculateAge(user.dateOfBirth);
    
    let message = '';
    if (todayIsBirthday) {
      message = `🎉 Happy ${age}${getOrdinalSuffix(age)} Birthday, ${user.name}! 🎂`;
    } else {
      const nextBirthday = getNextBirthday(user.dateOfBirth);
      const daysUntilBirthday = Math.ceil((nextBirthday - new Date()) / (1000 * 60 * 60 * 24));
      message = `${daysUntilBirthday} days until your ${age + 1}${getOrdinalSuffix(age + 1)} birthday!`;
    }
    
    res.status(200).json({
      success: true,
      isBirthday: todayIsBirthday,
      age: age,
      message: message,
      dateOfBirth: user.dateOfBirth
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

// Helper function to get next birthday date
const getNextBirthday = (dateOfBirth) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthDate = new Date(dateOfBirth);
  
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // If birthday has already passed this year, set to next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  
  return nextBirthday;
};

module.exports = router;
