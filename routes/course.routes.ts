import { Router } from 'express'
import { fetchCourses } from '../controllers/course.controller'

const courseRouter = Router()

courseRouter.get('/', fetchCourses)

export default courseRouter
