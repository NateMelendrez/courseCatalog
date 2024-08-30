"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const course_routes_1 = __importDefault(require("../routes/course.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const baseURL = "/api/v1";
const corsOptions = {
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(`${baseURL}/courses`, course_routes_1.default);
// app.use("/", (req, res) => res.send({ app: "web_course" }));
app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));
