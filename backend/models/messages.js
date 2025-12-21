import { Sequelize } from "sequelize";
import connectDB from "../config/db.js";

import WorkflowNode from "./workflowNodes.js";
import Chat from "./chats.js";

const sequelize = connectDB();

const Message = sequelize.define(
    "Message",
    {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        }, 
        chat_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: Chat,
                key: "id",
            },
        },
        node_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: {
                model: WorkflowNode,
                key: "id",
            },
        },
        sender_type: {
            type: Sequelize.ENUM("user", "bot"),
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        }, 
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }, {
        tableName: "messages",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
); 

Message.belongsTo(Chat, { foreignKey: "chat_id" });
Message.belongsTo(WorkflowNode, { foreignKey: "node_id" });

await Message.sync();
export default Message;