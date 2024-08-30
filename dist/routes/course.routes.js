"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const courseRouter = (0, express_1.Router)();
courseRouter.get("/", course_controller_1.fetchCourses);
exports.default = courseRouter;
