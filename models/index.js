const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Question  = require('./question');
const Answer = require('./answer');
const Introduction = require('./introduction');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Question = Question;
db.Answer = Answer;
db.Introduction = Introduction;

User.init(sequelize);
Question.init(sequelize);
Answer.init(sequelize);
Introduction.init(sequelize);

User.associate(db);
Question.associate(db);
Answer.associate(db);
Introduction.associate(db);

module.exports = db;