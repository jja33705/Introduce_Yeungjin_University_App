const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Japan } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가없어  uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const japan = await Japan.create({
            content: req.body.content,
            title: req.body.title,
            UserId: req.user.id,
            img: req.body.url,
        });
        res.redirect(`/japan/post/${japan.id}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/post/:id', async (req, res, next) => {
    try {
        const japan = await Japan.findOne({
            where: { id: req.params.id },
        });
        res.render('japanPost.html', { japan: japan });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/posting', isLoggedIn, (req, res, next) => {
    res.render('postingJapan.html');
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});



module.exports = router;