const subjects = require("../models/subject.model");
const timetable = require("../models/timetable.model");

let constants = {
    school: 'school',
    schoolsuperadmin: 'schoolsuperadmin',
    db_vnsgucollage_2025_2026: 'db_vnsgucollage_2025_2026',
    Model: {
        admin: 'admin',
        role: 'role',
        lead: 'lead',
        school: 'school',
        auth: 'auth',
        schoolsuperAdmin: 'schoolsuperAdmin',
        schoolbranch: 'schoolbranch',
    },
        supermodel: {
        auth: 'auth',
        role: 'role',
        academicyear: 'academicyear',
        section: 'section',
        class: 'class',
        subject: 'subject',
        student: 'student',
        teacher: 'teacher',
        board: 'board',
        semester: 'semester',
        stream: 'stream',
        standard: 'standard',
        day: 'day',
        medium: 'medium',
        timetable: 'timetable',
        attendancestudent: 'attendancestudent',
        attendanceteacher: 'attendanceteacher',
    }

};
module.exports = constants;
