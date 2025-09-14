import express from 'express';
import NotificationManager from '../notification-manager.js';

const router = express.Router();
const notificationManager = NotificationManager.getInstance();

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming auth middleware sets user
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const {
      status,
      category,
      limit = '50',
      offset = '0',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      status: status as any,
      category: category as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    };

    const result = await notificationManager.getUserNotifications(userId, options);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving notifications'
    });
  }
});

// Get notification stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const stats = await notificationManager.getUserStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving notification stats'
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const success = await notificationManager.markAsRead(userId, notificationId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating notification'
    });
  }
});

// Mark notification as archived
router.put('/:notificationId/archive', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const success = await notificationManager.markAsArchived(userId, notificationId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification archived'
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating notification'
    });
  }
});

// Delete notification
router.delete('/:notificationId', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const success = await notificationManager.deleteNotification(userId, notificationId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting notification'
    });
  }
});

// Get user preferences
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const preferences = await notificationManager.getUserPreferences(userId);
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving preferences'
    });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const preferences = req.body;
    const success = await notificationManager.updateUserPreferences(userId, preferences);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Error updating preferences'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating preferences'
    });
  }
});

// Create sample notifications (for testing)
router.post('/sample', async (req, res) => {
  try {
    await notificationManager.createMedicalNotifications();
    
    res.json({
      success: true,
      message: 'Sample notifications created'
    });
  } catch (error) {
    console.error('Error creating sample notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating sample notifications'
    });
  }
});

export default router;