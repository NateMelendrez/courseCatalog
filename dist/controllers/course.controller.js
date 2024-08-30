"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCourses = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("../middlewares/error.middleware");
const date_fns_1 = require("date-fns");
dotenv_1.default.config();
const API_URL = 'https://api.tovuti.io/api/v1/courses?page=1&pageSize=250';
//const API_URL = 'https://api.tovuti.io/api/v1/courses?page=1&pageSize=250';
const API_KEY = process.env.TOVUTI_API_KEY;
const formatDate = (dateString) => {
    const parsedDate = (0, date_fns_1.parseISO)(dateString);
    return (0, date_fns_1.format)(parsedDate, 'dd-MMM-yyyy');
};
const fetchCourses = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { data: { data: course } } = await axios_1.default.get(API_URL, { headers: { Authorization: `Bearer ${API_KEY}` } });
    // Selected attributes
    const attributes = [
        "id", "title", "description", "customFields", "created_on", "slug"
    ];
    // Selected custom fields
    const customFieldIds = [34, 30, 32, 36];
    let filteredData = course.map((item) => {
        const filteredItem = {};
        attributes.forEach(attr => {
            if (item.hasOwnProperty(attr)) {
                if (attr === "customFields") {
                    const filteredCustomFields = item.customFields.filter((field) => customFieldIds.includes(field.field_id));
                    //filteredItem.customFields = filteredCustomFields;
                    filteredCustomFields.forEach((field) => {
                        const attributeName = field.title.toLocaleLowerCase().split(" ").join("_");
                        filteredItem[attributeName] = field.value;
                    });
                }
                else if (attr === "created_on") {
                    filteredItem[attr] = formatDate(item[attr]);
                }
                else {
                    filteredItem[attr] = item[attr];
                }
            }
        });
        return filteredItem;
    });
    // >>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<
    // FOR FETCHING COURSES FOR SPECIFIC USER WITH FILTERRED USERGROUP
    const userId = 1784427;
    const { data: user } = await axios_1.default.get(`https://api.tovuti.io/api/v1/user/${userId}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
    const ids = filteredData.map((data) => data.id);
    const userGroup = [
        {
            id: 103,
            title: "Employees"
        },
        {
            id: 104,
            title: "Customers"
        },
        {
            id: 105,
            title: "Partners"
        }
    ];
    const userGroupIds = userGroup.filter((group) => user.userGroupIds.includes(group.id)).map(group => group.title);
    //const filteredCourses =  filteredData.filter((course: any) => userGroupIds.some(ids => ids.title === course.audience.split(";").map((item: any) => item.trim())));
    const filteredDatav1 = filteredData.map(course => ({
        ...course,
        audience: course.audience
            ? course.audience.split(';').map(item => item.trim())
            : [],
    }));
    //const matchedGroups = filteredDatav1.filter((course: any) => course.audience.includes("Partners"));
    const matchedGroups = filteredDatav1.filter((course) => course.audience.some((audience) => userGroupIds.includes(audience)));
    // console.log("groupIds",userGroupIds);
    // console.log("No. of courses",matchedGroups.length);
    //console.log("Courses",matchedGroups);
    // >>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<
    const courseIds = filteredData.map((data) => data.id);
    res.status(200).send({
        message: "List of Courses",
        number_of_courses: filteredData.length,
        //data: matchedGroups,
        data: filteredData
    });
});
exports.fetchCourses = fetchCourses;
