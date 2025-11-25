const express = require("express");
const router = express.Router();
const promisePool = require("../../db");
const verifyToken = require("../middleware/verifyToken");

router.post("/my-courses", verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        uc.courses_code,
        uc.courses_name,
        uc.start_date,
        uc.end_date,
        uc.status,
        uc.courses_amount,  
        uc.pending_amount,
        uc.img_url,
        ua.id AS addon_id, 
        ua.title,
        ua.ebook_link,
        ua.syllabus_link,
        ua.video_link,
        ua.interview_question_link,
        ua.ref_link,
        ua.quiz_id,
        ua.feedback_id
      FROM user_courses uc
      LEFT JOIN user_addons ua ON uc.id = ua.course_id 
      ORDER BY uc.start_date DESC, ua.id ASC; 
    `;

    const [rows] = await promisePool.query(sql);

    const coursesMap = new Map();

    rows.forEach((row) => {
      // 1. Create Course Object if it doesn't exist
      if (!coursesMap.has(row.courses_code)) {
        coursesMap.set(row.courses_code, {
          courses_code: row.courses_code,
          courses_name: row.courses_name,
          start_date: row.start_date,
          end_date: row.end_date,
          status: row.status,
          courses_amount: row.courses_amount,
          pending_amount: row.pending_amount,
          img_url: row.img_url,
          addons: [],
        });
      }

      // 2. Process Addons
      if (row.title) {
        let type = "";
        let value = null;

        if (row.video_link) {
          type = "video";
          value = row.video_link;
        } else if (row.ebook_link) {
          type = "ebook";
          value = row.ebook_link;
        } else if (row.syllabus_link) {
          type = "syllabus";
          value = row.syllabus_link;
        } else if (row.quiz_id) {
          type = "quiz";
          value = row.quiz_id;
        } else if (row.feedback_id) {
          type = "feedback";
          value = row.feedback_id;
        } else if (row.interview_question_link) {
          type = "interview_question";
          value = row.interview_question_link;
        } else if (row.ref_link) {
          type = "reference_link";
          value = row.ref_link;
        }

        if (type) {
          const course = coursesMap.get(row.courses_code);
          let existingTypeGroup = course.addons.find((a) => a.type === type);

          if (existingTypeGroup) {
            existingTypeGroup.resources.push({
              id: row.addon_id,
              title: row.title,
              url_or_id: value,
            });
          } else {
            course.addons.push({
              type: type,
              resources: [
                {
                  id: row.addon_id,
                  title: row.title,
                  url_or_id: value,
                },
              ],
            });
          }
        }
      }
    });

    const results = Array.from(coursesMap.values());

    // ------------------------------------------
    // FIX: SORTING LOGIC
    // ------------------------------------------

    // 1. Define the Priority (Lower number = Higher Priority)
    const addonPriority = {
      "ebook": 1,              // 1. Ebook
      "syllabus": 2,           // 2. Syllabus
      "video": 3,              // 3. Video
      "feedback": 4,           // 4. Feedback
      "quiz": 5,               // 5. Quiz
      "interview_question": 6, // 6. Interview Question
      "reference_link": 7      // 7. Reference Link
    };

    // 2. Apply Sort
    results.forEach((course) => {
      if (course.addons && course.addons.length > 0) {
        course.addons.sort((a, b) => {
          // Get priority, default to 99 if missing
          const priorityA = addonPriority[a.type] || 99;
          const priorityB = addonPriority[b.type] || 99;

          // Sort ascending (1, 2, 3...)
          return priorityA - priorityB;
        });
      }
    });
    // ------------------------------------------

    res.status(200).json(results);
  } catch (error) {
    console.error("My Courses Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});
// GET Questions by Course ID
router.get("/quiz-questions/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // We select questions from 'course_quizzes' table matching the course_id
    const sql = `
      SELECT * FROM course_quizzes 
      WHERE course_id = ?
    `;

    const [questions] = await promisePool.query(sql, [courseId]);

    res.status(200).json(questions);
  } catch (error) {
    console.error("Quiz Error:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});
// GET Feedback Questions by Course ID
router.get("/feedback-questions/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const sql = `SELECT * FROM course_feedbacks WHERE course_id = ?`;
    const [questions] = await promisePool.query(sql, [courseId]);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});




module.exports = router;
