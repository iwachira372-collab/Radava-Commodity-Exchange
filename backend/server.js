const express  = require("express")
const cors = require("cors")
const cluster = require("cluster")
const helmet = require("helmet")
const os = require("os")
const path = require("path")
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
app.get('/health', (req, res) => {
  res.send({ status: 'ok' })
})
createRoutes(app)
app.use(express.static(path.join(__dirname, "../client/build")))
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/admin/") || req.path === "/callback") {
    return res.status(404).json({ error: "404 not found" })
  }
  return res.sendFile(path.join(__dirname, "../client/build", "index.html"))
})

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
