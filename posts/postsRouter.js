const express = require('express');
const router = express.Router();

const db = require('../data/db');

router.post('/', (req, res) => {
    const post = req.body;

    if (!post.title || !post.contents) {
        res.status(400).json(
            {
                success: false,
                errorMessage: "Please provide title and contents for the post."
            }
        )
    } else {
        db.insert(post)
        .then(post => 
            db.findById(post.id)
            .then(newPost => {
                console.log(newPost)
                res.status(201).json(
                    {
                        success: true,
                        post: newPost
                    }
                )
            })
        )
        .catch(() => res.status(500).json(
            {
                success: false,
                error: "There was an error while saving the post to the database"
            }
        )
    )}
})

router.post('/:id/comments', async (req, res) => {
    const id = req.params.id;
    const comment = {...req.body, post_id: id}

    try {
        const post = await db.findById(id);
        if (post.length === 0) {
            res.status(404).json(
                {
                    success: false,
                    message: "The post with the specified ID does not exist."
                }
            )
        } else if (!comment.text) {
            res.status(400).json(
                {
                    success: false,
                    errorMessage: "Please provide text for the comment."
                }
            )
        } else {
            db.insertComment(comment)
                .then(result => {
                        console.log(result)
                        res.status(201).json(
                            {
                                success: true,
                                comment: result
                            }
                        )
                    })
                    .catch(error => console.log(error))
                }
    } catch (err) {
        res.status(500).json(
            {
                success: false,
                error: "There was an error while saving the comment to the database"
            }
        );
    }
  })

router.get('/', (req, res) => {
    db.find()
    .then(posts => res.status(200).json(
        {
            success: true,
            posts: posts
        }
    ))
    .catch(() => res.status(500).json(
        {
            success: false,
            error: "The posts information could not be retrieved."
        }
    ))
})

router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const post = await db.findById(id);
        if (post.length === 0) {
            res.status(404).json(
                {
                    success: false,
                    message: "The post with the specified ID does not exist."
                }
            )
        } else {
            res.status(200).json(
                {
                    success: true,
                    post: post
                }
            )
        }
    }
    catch (err) {
        res.status(500).json(
            {   
                success: false,
                error: "The post information could not be retrieved."
            }
        )
    }
})

router.get('/:id/comments', async (req, res) => {
    const id = req.params.id;

    try {
        const postComments = await db.findPostComments(id);
        if (postComments.length > 0) {
            res.status(200).json(
                {
                    success: true,
                    comments: postComments
                }
            )
        } else {
            res.status(404).json(
                {
                    success: false,
                    message: "The post with the specified ID does not exist."
                }
            )
        } 
    }
    catch (err) { 
        res.status(500).json(
            {
                success: false,
                error: "The comments information could not be retrieved."
            }
        )
    }
})

module.exports = router;