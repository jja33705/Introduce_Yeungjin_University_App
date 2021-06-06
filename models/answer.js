const Sequelize = require('sequelize');

module.exports = class Answer extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Answer',
            tableName: 'answers',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Answer.belongsTo(db.User);
        db.Answer.belongsTo(db.Question);
    }
}