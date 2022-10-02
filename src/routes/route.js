const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController")
const commonMW = require("../middleware/auth");
const aws= require("aws-sdk")


// USER API
// register user route
router.post("/register", userController.createUser);
// login user
router.post("/login", userController.userLogin);


//BOOK API
//  create a book
router.post("/books", commonMW.authenticate, bookController.createBook);
// Get Books
router.get("/books", commonMW.authenticate, bookController.getBooks);
// GET One Book
router.get("/books/:bookId", commonMW.authenticate, bookController.getBookById);
// Update Book
router.put("/books/:bookId", commonMW.authenticate, bookController.updateBooks);
// Delete Book
router.delete("/books/:bookId", commonMW.authenticate, bookController.deleteBook);


// Review API
// Create Review
router.post("/books/:bookId/review", reviewController.postReview)
// Update review
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
// Delete review
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

// router.all("/*", function (req, res) {
//   res.status(400).send({
//     status: false,
//     message: "The api you request is not available",
//   });
// });

//====================================aws3===============================================================================

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err.message})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})


module.exports = router;
