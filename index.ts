import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import courseRoutes from './routes/course.routes'

dotenv.config()
const app = express()
const baseURL = '/api/v1'
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders:
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(`${baseURL}/courses`, courseRoutes)
// app.use("/", (req, res) => res.send({ app: "web_course" }));

app.listen(process.env.PORT || 8080, () =>
  console.log(`Server is listening on port ${process.env.PORT}`),
)
