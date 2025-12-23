import { Sequelize } from "sequelize";
import connectDB from '../config/db.js';

import Chat from "./chats.js";

const sequelize = await connectDB();

const ChatVariable = sequelize.define('ChatVariable', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }, 
    chat_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: Chat,
            key: 'id'
        }
    }, 
    variable_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    variable_value: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    tableName: 'chat_variables',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})


ChatVariable.belongsTo(Chat, { foreignKey: 'chat_id' });

await ChatVariable.sync();
export default ChatVariable;