const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { //로그인 시 실행: 사용자 정보 객체를 세션에 아이디로 저장
        done(null, user.id); //사용자 id를 세션에 저장
    });

    passport.deserializeUser((id, done) => { //매 요청 시 실행: 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴
        User.findOne({ where: { id }})
        .then(user => done(null, user)) //user를 req.user에 저장
        .catch(err => done(err));
    }); 
    
    local();
}