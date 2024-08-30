import axios from 'axios'
import dotenv from 'dotenv'
import { asyncHandler } from '../middlewares/error.middleware'
import { Request, Response } from 'express'
import { Course, CustomField } from '../models/models'
import { parseISO, format } from 'date-fns'

dotenv.config()

const API_URL = 'https://api.tovuti.io/api/v1/courses?page=1&pageSize=250'
// const API_URL = 'https://api.tovuti.io/api/v1/courses?page=1&pageSize=250';
const API_KEY = process.env.TOVUTI_API_KEY

type Item = {
  [key: string]: any
}

const formatDate = (dateString: string) => {
  const parsedDate = parseISO(dateString)
  process.env.PORT || 8080
  return format(parsedDate, 'dd-MMM-yyyy')
}

const fetchCourses = asyncHandler(async (req: Request, res: Response) => {
  const {
    data: { data: course },
  } = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })

  // Selected attributes
  const attributes: string[] = [
    'id',
    'title',
    'description',
    'customFields',
    'created_on',
    'slug',
  ]

  // Selected custom fields
  const customFieldIds = [34, 30, 32, 36]

  const filteredData: Course[] = course.map((item: Item) => {
    const filteredItem: Partial<Course> = {}

    attributes.forEach((attr) => {
      if (item.hasOwnProperty(attr)) {
        if (attr === 'customFields') {
          const filteredCustomFields = item.customFields.filter(
            (field: CustomField) => customFieldIds.includes(field.field_id),
          )
          // filteredItem.customFields = filteredCustomFields;
          filteredCustomFields.forEach((field: CustomField) => {
            const attributeName = field.title
              .toLocaleLowerCase()
              .split(' ')
              .join('_')
            ;(filteredItem as any)[attributeName] = field.value
          })
        } else if (attr === 'created_on') {
          filteredItem[attr] = formatDate(item[attr])
        } else {
          filteredItem[attr as keyof Course] = item[attr]
        }
      }
    })
    return filteredItem as Course
  })

  // >>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<
  // FOR FETCHING COURSES FOR SPECIFIC USER WITH FILTERRED USERGROUP
  const userId = 1784427
  const { data: user } = await axios.get(
    `https://api.tovuti.io/api/v1/user/${userId}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } },
  )

  const ids = filteredData.map((data: any) => data.id)
  const userGroup = [
    {
      id: 103,
      title: 'Employees',
    },
    {
      id: 104,
      title: 'Customers',
    },
    {
      id: 105,
      title: 'Partners',
    },
  ]

  const userGroupIds = userGroup
    .filter((group: any) => user.userGroupIds.includes(group.id))
    .map((group) => group.title)
  // const filteredCourses =  filteredData.filter((course: any) => userGroupIds.some(ids => ids.title === course.audience.split(";").map((item: any) => item.trim())));

  const filteredDatav1 = filteredData.map((course) => ({
    ...course,
    audience: course.audience
      ? course.audience.split(';').map((item) => item.trim())
      : [],
  }))

  // const matchedGroups = filteredDatav1.filter((course: any) => course.audience.includes("Partners"));
  const matchedGroups = filteredDatav1.filter((course: any) =>
    course.audience.some((audience: string) => userGroupIds.includes(audience)),
  )
  // console.log("groupIds",userGroupIds);
  // console.log("No. of courses",matchedGroups.length);
  // console.log("Courses",matchedGroups);

  // >>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<

  const courseIds = filteredData.map((data: any) => data.id)
  res.status(200).send({
    message: 'List of Courses',
    number_of_courses: filteredData.length,
    // data: matchedGroups,
    data: filteredData,
  })
})

export { fetchCourses }
