const express = require('express');
const multer = require('multer');
const router = express.Router();
const { isLoggedIn } = require('./middlewares');
const path = require('path');
const  fs = require('fs');
const { Introduction, User } = require('../models');

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가없어  uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

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

router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const introduction = await Introduction.findOne({
            where: { UserId: req.params.id },
        });
        if (introduction) {
            res.render('introduce.html', { introduction: introduction });
        } else {
            res.render('introduce.html', {});
        }
    } catch (err) {
        console.error(err);
        next(err);
    };
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const introduction = await Introduction.findOne({
            where: { UserId: req.params.id },
        });
        if (introduction) {
            res.render('introduce.html', { introduction: introduction });
        } else {
            res.render('introduce.html', {});
        }
    } catch (err) {
        console.error(err);
        next(err);
    };
});

const upload2 = multer();
router.post('/introduce', isLoggedIn, upload2.none(), async (req, res, next) => {
    try{
        const introduction = await Introduction.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        res.redirect('/introduction');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const introduction = await Introduction.findOne({ where: { id: req.params.id } });
        if (introduction.UserId === req.user.id) {
            if(req.body.url) {
                await Introduction.update({
                    content: req.body.content,
                    img: req.body.url,
                }, {
                    where: { id: req.params.id },
                });
            } else {
                await Introduction.update({
                    content: req.body.content,
                }, {
                    where: { id: req.params.id },
                });
            }
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try{
        const introduction = await Introduction.findOne({ where: { id: req.params.id } });
        if (introduction.UserId === req.user.id) {
            await Introduction.destroy({ where: { id: req.params.id }});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;