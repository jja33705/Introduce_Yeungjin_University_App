const express = require('express');

const { Question, Answer, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const sequelize = require('sequelize');

const router = express.Router();

router.get('/ask', isLoggedIn, (req, res, next) => {
    res.render('ask.html');
});

router.post('/ask', isLoggedIn, async (req, res, next) => {
    try {
        const question = await Question.create({
            content: req.body.content,
            title: req.body.title,
            UserId: req.user.id,
        });
        res.redirect(`/qna/${question.id}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/ask/:id', isLoggedIn, async (req, res, next) => {
    const question = await Question.findOne({
        where: { id: req.params.id },
    });
    res.render('ask.html', { question: question });
});

router.patch('/ask/:id', isLoggedIn, async (req, res, next) => {
    try {
        const question = await Question.findOne({ where: { id: req.params.id } });
        if (question.UserId === req.user.id) {
            await Question.update({
                title: req.body.title,
                content: req.body.content,
            }, {
                where: { id: req.params.id },
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    const questionId = req.params.id;
    try {
        const question = await Question.findOne({ 
            attributes:  [
                'id',
                'title', 
                [sequelize.fn('date_format', sequelize.col('Question.updatedAt'), '%Y-%m-%d'), 'updatedAt'], 
                'content',
            ],
            include: [{
                model: User,
            }],
            where: {
                id:  questionId,
            },
            order: [['updatedAt', 'DESC']],
        });
        if (question) {
            const answers = await question.getAnswers({
                attributes: [
                    [sequelize.fn('date_format', sequelize.col('Answer.updatedAt'), '%Y-%m-%d'), 'updatedAt'], 
                    'content', 'id'
                ],
                include: {
                    model: User,
                },
                order: [['updatedAt', 'DESC']],
            });
            res.render('question.html', { question: question , answers: answers});
        } else {
            return res.redirect('/qna?error=noExist');
        }
    } catch (error) { 
        console.error(error);
        next(err);
    }
});

router.delete('/question/:id', isLoggedIn, async (req, res, next) => {
    try{
        const question = await Question.findOne({ where: { id: req.params.id } });
        if (question.UserId === req.user.id) {
            await Question.destroy({ where: { id: req.params.id }});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/answer', isLoggedIn, async (req, res, next) => {
    const questionId = req.params.id;
    try {
        await Answer.create({
            QuestionId: questionId,
            content: req.body.content,
            UserId: req.user.id,
        });
        res.redirect(`/qna/${questionId}`);
    } catch (error) { 
        console.error(error);
        next(err);
    }
});

router.delete('/answer/:id', isLoggedIn, async (req, res, next) => {
    try{
        const answer = await Answer.findOne({ where: { id: req.params.id } });
        if (answer.UserId === req.user.id) {
            await Answer.destroy({ where: { id: req.params.id }});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;