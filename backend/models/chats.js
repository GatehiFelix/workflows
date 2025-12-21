import { Sequelize } from "sequelize";
import connectDB from "../config/db.js";

import Bot from "./bot.js";
import User from "./user.js";
import workflowNodes from "./workflowNodes.js";

const sequelize = connectDB();

const Chat = sequelize.define(
    "Chat",
    {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        bot_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Bot,
                key: "id",
            },
        },
        user_id:{
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        current_node_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: {
                model: workflowNodes,
                key: "id",
            },
        },
        context: { 
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: {}
        },
        status: { 
            type: Sequelize.ENUM('active', 'completed', 'archived'),
            allowNull: false,
            defaultValue: 'active'
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        }
    }, {
        tableName: "chats",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);


Chat.belongsTo(Bot, { foreignKey: "bot_id" });
Chat.belongsTo(User, { foreignKey: "user_id" });
Chat.belongsTo(workflowNodes, { foreignKey: "current_node_id" });

await Chat.sync();
export default Chat;