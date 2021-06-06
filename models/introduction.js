const Sequelize = require('sequelize');

module.exports = class Introduction extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Introduction',
            tableName: 'introductions',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Introduction.belongsTo(db.User, { foreignKey: 'UserId', targetKey: 'id' });
    }
};