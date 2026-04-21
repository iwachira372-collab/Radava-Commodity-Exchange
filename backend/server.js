const express  = require("express")
const cors = require("cors")
const cluster = require("cluster")
const helmet = require("helmet")
const os = require("os")
const {createRoutes}  = require("./src/routes/router")
const bodyParser = require("body-parser")

const app  = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
const options = {
    origin:'*'
}
app.use(cors(options))
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use('/public',express.static('public'))
app.get('/', (req, res) => {
  res.send({
    status: 'ok',
    service: 'radava-exchange-api',
    message: 'API is running. Use /api/* and /admin/* endpoints.'
  })
})

app.get('/health', (req, res) => {
  res.send({ status: 'ok' })
})
createRoutes(app)

// if(cluster.isPrimary){
//   const cpus = os.cpus().length
//   console.log(cpus)
//   for (let i = 0; i < cpus; i++) {
//     cluster.fork()
//   }
//   cluster.on('exit', () => cluster.fork())
// }else{
//     app.listen(8000,()=>console.log(""))
//   }
const PORT = process.env.PORT || 5001;
app.listen(PORT,()=>console.log("Server running on port " + PORT + " - instance id: " + process.pid))
