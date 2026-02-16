const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/scans
// @desc    Get all scans for current user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [scans] = await pool.query(
      'SELECT * FROM scan_results WHERE userId = ? ORDER BY createdAt DESC',
      [req.user.id]
    );

    // Parse JSON fields
    const formattedScans = scans.map(scan => {
      let predictions = scan.allPredictions;
      
      // Parse JSON if it's a string, otherwise use as-is
      if (typeof predictions === 'string') {
        try {
          predictions = JSON.parse(predictions);
        } catch (error) {
          console.error('Error parsing predictions for scan:', scan.id, error);
          predictions = [];
        }
      }
      
      return {
        id: scan.id,
        timestamp: scan.createdAt,
        patientData: {
          firstName: scan.patientFirstName,
          patientId: scan.patientId,
          username: scan.patientUsername,
          gender: scan.patientGender,
          age: scan.patientAge?.toString() || ''
        },
        imageDataUrl: scan.imageData,
        isValidSkinImage: scan.isValidSkinImage,
        topPrediction: {
          classId: scan.topPredictionClass,
          probability: parseFloat(scan.topPredictionProbability),
          className: getClassName(scan.topPredictionClass)
        },
        predictions: predictions
      };
    });

    res.json({
      success: true,
      scans: formattedScans
    });
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan history'
    });
  }
});

// @route   POST /api/scans
// @desc    Save new scan result
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { scanResult } = req.body;

    const scanId = `scan_${Date.now()}`;
    
    await pool.query(
      `INSERT INTO scan_results 
      (id, userId, patientFirstName, patientId, patientUsername, patientGender, patientAge, 
       imageData, isValidSkinImage, topPredictionClass, topPredictionProbability, allPredictions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        scanId,
        req.user.id,
        scanResult.patientData.firstName,
        scanResult.patientData.patientId,
        scanResult.patientData.username,
        scanResult.patientData.gender,
        parseInt(scanResult.patientData.age) || null,
        scanResult.imageDataUrl,
        scanResult.isValidSkinImage,
        scanResult.topPrediction.classId,
        scanResult.topPrediction.probability,
        JSON.stringify(scanResult.predictions)
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Scan saved successfully',
      scanId
    });
  } catch (error) {
    console.error('Save scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save scan result'
    });
  }
});

// @route   DELETE /api/scans/:id
// @desc    Delete a scan
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM scan_results WHERE id = ? AND userId = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });
  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scan'
    });
  }
});

// @route   DELETE /api/scans
// @desc    Clear all scans for current user
// @access  Private
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM scan_results WHERE userId = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'All scans deleted successfully'
    });
  } catch (error) {
    console.error('Clear scans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear scan history'
    });
  }
});

// Helper function
function getClassName(classId) {
  const classNames = {
    0: 'akiec',
    1: 'bcc',
    2: 'bkl',
    3: 'df',
    4: 'mel',
    5: 'nv',
    6: 'vasc',
  };
  return classNames[classId] || 'unknown';
}

module.exports = router;

