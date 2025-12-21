import { Sequelize } from "sequelize";

import connectDB from '../config/db.js';
import Bot from './bot.js';
import WorkflowNode from './workflowNodes.js';

const sequelize = connectDB();

const Workflow = sequelize.define('Workflow', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }, 
    bot_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: Bot,
            key: 'id'
    }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start_node: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
            model: WorkflowNode,
            key: 'id'
        }
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    tableName: 'workflows',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});


Workflow.belongsTo(Bot, { foreignKey: 'bot_id' });


await Workflow.sync();
export default Workflow;