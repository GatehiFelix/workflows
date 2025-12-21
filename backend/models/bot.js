import { Sequelize } from "sequelize";

import connectDB from '../config/db.js';
import User from './user.js';

const sequelize = connectDB();

const Bot = sequelize.define('Bot', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    tableName: 'bots',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})

Bot.belongsTo(User, { foreignKey: 'user_id' });


await Bot.sync();
export default Bot;