const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Question, User, Introduction, Japan } = require('../models');
const  sequelize = require('sequelize');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/join', isNotLoggedIn, (req,res) => {
    res.render('join', { title: '회원가입' });
});

router.get('/introduction', async (req, res, next) => {
    try {
        const introductions = await Introduction.findAll({
            include: {
                model: User,
            },
            order: [['updatedAt', 'DESC']],
        });
        res.render('introduction.html', { title: "자기소개", introductions: introductions });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/japan', async (req, res, next) => {
    try {
        const japans = await Japan.findAll({
            attributes: [
                'id',
                'title', 
                [sequelize.fn('date_format', sequelize.col('Japan.updatedAt'), '%Y-%m-%d'), 'updatedAt'], 
                'content', 'img'
            ],
            include: {
                model: User,
            },
            order: [['updatedAt', 'DESC']],
        });
        res.render('japan.html', { title: '현지학기제' , japans: japans});
    } catch (err) {
        console.error(err);
        next(err);
    }
    
});

router.get('/qna', async (req, res, next) => {
    try {
        const questions = await Question.findAll({
            attributes: [
                'id',
                'title', 
                [sequelize.fn('date_format', sequelize.col('Question.updatedAt'), '%Y-%m-%d'), 'updatedAt'], 
                'content',
            ],
            include: {
                model: User,
            },
            order: [['updatedAt', 'DESC']],
        });
        res.render('qna.html', { title: '질의응답',  questions: questions });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/', (req, res, next) => {
    res.render('index.html');
});

module.exports = router;