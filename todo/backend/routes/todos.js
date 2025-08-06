const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Use protect middleware for all routes
router.use(protect);

// @desc    Get all todos for user
// @route   GET /api/todos
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort').optional().isIn(['createdAt', '-createdAt', 'dueDate', '-dueDate', 'priority', '-priority', 'title', '-title']).withMessage('Invalid sort field'),
  query('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  query('category').optional().isIn(['personal', 'work', 'shopping', 'health', 'education', 'travel', 'other']).withMessage('Invalid category'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    // Build query
    let query = { user: req.user.id };

    // Filter by completion status
    if (req.query.completed !== undefined) {
      query.completed = req.query.completed === 'true';
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Date filters
    if (req.query.dueDateFrom || req.query.dueDateTo) {
      query.dueDate = {};
      if (req.query.dueDateFrom) {
        query.dueDate.$gte = new Date(req.query.dueDateFrom);
      }
      if (req.query.dueDateTo) {
        query.dueDate.$lte = new Date(req.query.dueDateTo);
      }
    }

    const todos = await Todo.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip(startIndex);

    const total = await Todo.countDocuments(query);

    // Pagination info
    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: todos.length,
      pagination,
      todos
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .isIn(['personal', 'work', 'shopping', 'health', 'education', 'travel', 'other'])
    .withMessage('Invalid category'),
  body('dueDate')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
    })
    .withMessage('Due date must be a valid date'),
  body('reminder')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
    })
    .withMessage('Reminder must be a valid date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag cannot be more than 20 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        details: errors.array().map(err => `${err.path}: ${err.msg}`).join(', '),
        requestBody: req.body
      });
    }

    // Clean up the request body - convert null strings to actual null
    if (req.body.dueDate === 'null' || req.body.dueDate === '') {
      req.body.dueDate = null;
    }
    if (req.body.reminder === 'null' || req.body.reminder === '') {
      req.body.reminder = null;
    }

    // Add user to req.body
    req.body.user = req.user.id;

    console.log('Creating todo with data:', JSON.stringify(req.body, null, 2));

    const todo = await Todo.create(req.body);

    res.status(201).json({
      success: true,
      todo
    });
  } catch (error) {
    console.error('Todo creation error:', error);
    next(error);
  }
});

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .isIn(['personal', 'work', 'shopping', 'health', 'education', 'travel', 'other'])
    .withMessage('Invalid category'),
  body('dueDate')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
    })
    .withMessage('Due date must be a valid date'),
  body('reminder')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
    })
    .withMessage('Reminder must be a valid date'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag cannot be more than 20 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Clear all todos (not just completed ones)
// @route   DELETE /api/todos/clear-all
// @access  Private
router.delete('/clear-all', async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({
      user: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} todos cleared`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add subtask to todo
// @route   POST /api/todos/:id/subtasks
// @access  Private
router.post('/:id/subtasks', [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Subtask title is required')
    .isLength({ max: 100 })
    .withMessage('Subtask title cannot be more than 100 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.subtasks.push({ title: req.body.title });
    await todo.save();

    res.status(201).json({
      success: true,
      todo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update subtask
// @route   PUT /api/todos/:id/subtasks/:subtaskId
// @access  Private
router.put('/:id/subtasks/:subtaskId', [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subtask title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Subtask title cannot be more than 100 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const subtask = todo.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    if (req.body.title !== undefined) subtask.title = req.body.title;
    if (req.body.completed !== undefined) subtask.completed = req.body.completed;

    await todo.save();

    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete subtask
// @route   DELETE /api/todos/:id/subtasks/:subtaskId
// @access  Private
router.delete('/:id/subtasks/:subtaskId', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const subtask = todo.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    subtask.deleteOne();
    await todo.save();

    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk update todos
// @route   PATCH /api/todos/bulk
// @access  Private
router.patch('/bulk', [
  body('todoIds')
    .isArray({ min: 1 })
    .withMessage('Todo IDs must be a non-empty array'),
  body('updates')
    .isObject()
    .withMessage('Updates must be an object'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { todoIds, updates } = req.body;

    const result = await Todo.updateMany(
      { _id: { $in: todoIds }, user: req.user.id },
      updates
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} todos updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk delete todos
// @route   DELETE /api/todos/bulk
// @access  Private
router.delete('/bulk', [
  body('todoIds')
    .isArray({ min: 1 })
    .withMessage('Todo IDs must be a non-empty array'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { todoIds } = req.body;

    const result = await Todo.deleteMany({
      _id: { $in: todoIds },
      user: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} todos deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
router.get('/stats/overview', async (req, res, next) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$dueDate', null] },
                    { $lt: ['$dueDate', new Date()] },
                    { $eq: ['$completed', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const categoryStats = await Todo.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        overdue: 0
      },
      categoryStats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
