const express = require('express');
const multer = require('multer');

const Post = require('./../models/posts');
const authChek = require('../middlewere/chek-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');

        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    }, 
    filename: (req, file, cb) =>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext );
        // cb(null,  name);
    }
});


router.post('',
 authChek,  
 multer({storage: storage}).single("image"), 
  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: "Post added successfully !",
            post : {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
})

router.get('', (req, res, next) => {
    console.log("req.query");
    const pageSize = +req.query.pageSize;    //  2
    const currentpage = +req.query.page;    //   1
    const postQuery = Post.find();
    
    if(pageSize && currentpage) {
        postQuery.skip( pageSize * (currentpage -1)).limit(pageSize)
    }
    postQuery.then(documents => {
        res.status(200).json({
            message: "Posts fetched succesfully !",
            posts: documents
        })
    });
})


router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  });

// router.get('/:id', (req, res, next) => {
//     Post.findById(req.params.id).then(post => {
//         if (post) {
//             res.status(200).json(post);
//         }
//         else {
//             res.status(404).json({ message: 'Post nod found!' });
//         }
//     })
// })

router.put(
    '/:id', 
    authChek,
  multer({storage: storage}).single("image"),  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    // console.log( req.params.id);
    Post.updateOne({ _id: req.params.id }, post).then(result => {     //       X  A  T  O  
        console.log(result);
        res.status(200).json({ message: 'Update succesfully !' })
    })
})

router.delete(
    '/:id', 
    // authChek, 
    (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "Post Deleted!" })
    })
})


module.exports = router;