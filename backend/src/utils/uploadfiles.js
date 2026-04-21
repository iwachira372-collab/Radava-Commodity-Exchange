const multer =require("multer");
const sharp =require("sharp");
const fs =require("fs");
const path =require("path");

const storage = multer.diskStorage({
    fileFilter:(req, file, cb)=>{
        // console.log(req.file,'files')
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
          } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
          }
    },
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  module.exports.upload = multer({ storage: storage })

module.exports.compress = async (req,res,next)=>{
   if(!req?.file) next()
   try {
        if (!fs.existsSync('public/'+req.user.email.split('@')[0])){
            fs.mkdirSync('public/'+req.user.email.split('@')[0]);
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const newFilePath = path.join('public/'+req.user.email.split('@')[0]+'/', uniqueSuffix+req.file.originalname);
        // save newFilePath in your db as image path
        await sharp(req.file.path).resize().jpeg({ quality: 50 }).toFile(newFilePath);
        req.body.identification_card = '/public/'+req.user.email.split('@')[0]+'/'+uniqueSuffix+req.file.originalname
        fs.unlink(req.file.path,(err)=>{});
   } catch (error) {
    res.status(500).send({error: "Invalid ID image"})
   }
    next()
}