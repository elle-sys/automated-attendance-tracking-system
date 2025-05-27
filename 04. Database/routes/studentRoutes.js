const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const UserLog = require('../models/UserLog');
const Course = require('../models/Course');

// ✅ Test endpoint
router.get('/test', async (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// ✅ Search students
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const students = await Student.find({
            $or: [
                { fullName: { $regex: searchQuery, $options: 'i' } },
                { idNumber: { $regex: searchQuery, $options: 'i' } }
            ]
        }).select('fullName idNumber');
        res.json(students);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get single student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Delete student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.deleteOne();
        res.json({ message: 'Student deleted successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Student login
router.post('/login', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const student = await Student.findOne({ idNumber: studentId });
        if (!student) {
            return res.status(401).json({ message: 'Invalid student ID or password' });
        }
        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid student ID or password' });
        }

        await UserLog.create({
            userId: student._id,
            userType: 'Student',
            fullName: student.fullName,
            idNumber: student.idNumber,
            action: 'login'
        });

        res.json({
            success: true,
            student: {
                id: student._id,
                idNumber: student.idNumber,
                fullName: student.fullName
            }
        });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Student logout
router.post('/logout', async (req, res) => {
    try {
        const { studentId } = req.body;
        const student = await Student.findOne({ idNumber: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await UserLog.create({
            userId: student._id,
            userType: 'Student',
            fullName: student.fullName,
            idNumber: student.idNumber,
            action: 'logout'
        });

        res.json({ success: true, message: 'Logged out successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Create student (open to everyone — no admin required)
router.post('/create', async (req, res) => {
    try {
        const { idNumber, fullName, password } = req.body;
        const existingStudent = await Student.findOne({ idNumber });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }

        const student = await Student.create({ idNumber, fullName, password });

        res.status(201).json({
            message: 'Student account created successfully',
            student: {
                idNumber: student.idNumber,
                fullName: student.fullName
            }
        });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Update student
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { idNumber, fullName } = req.body;
        if (idNumber !== student.idNumber) {
            const existingStudent = await Student.findOne({ idNumber });
            if (existingStudent) {
                return res.status(400).json({ message: 'ID Number is already taken' });
            }
        }

        student.idNumber = idNumber;
        student.fullName = fullName;
        await student.save();

        res.json({
            message: 'Student updated successfully',
            student: {
                _id: student._id,
                idNumber: student.idNumber,
                fullName: student.fullName
            }
        });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get enrolled courses
router.get('/enrolled-courses/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ idNumber: studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const courses = await Course.find({ students: studentId });

        const formattedCourses = await Promise.all(courses.map(async course => {
            let instructorName = course.instructor;
            try {
                const Instructor = require('../models/Instructor');
                const instructorDoc = await Instructor.findOne({ idNumber: course.instructor });
                if (instructorDoc) {
                    instructorName = instructorDoc.fullName;
                }
            } catch (err) {
                console.log('Error fetching instructor:', err);
            }

            return {
                id: course._id,
                courseCode: course.courseCode,
                courseName: course.courseName,
                instructor: instructorName,
                schedule: course.schedule || 'Schedule not set',
                room: course.room || 'Room not set'
            };
        }));

        res.json({
            success: true,
            courses: formattedCourses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrolled courses',
            error: error.message
        });
    }
});

module.exports = router;
