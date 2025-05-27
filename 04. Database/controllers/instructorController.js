// controllers/instructorController.js
const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

exports.getInstructorTrends = async (req, res) => {
  try {
    const { instructorId } = req;

    const courses = await Course.find({ instructorId }).select('_id');
    const courseIds = courses.map(c => c._id);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    const labels = last7Days.map(date => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
    });

    const counts = await Promise.all(last7Days.map(async date => {
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const count = await Attendance.countDocuments({
        courseId: { $in: courseIds },
        createdAt: { $gte: start, $lte: end }
      });

      return count;
    }));

    return res.json({
      labels,
      datasets: [
        {
          data: counts,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load trend data' });
  }
};
