import { Sequelize } from 'sequelize';
import connectDB from '../config/db.js';
import WorkflowNode from './workflowNodes.js';

const sequelize = await connectDB();

const NodeButton = sequelize.define('NodeButton', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    node_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: WorkflowNode,
            key: 'id'
        }
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    action: {
        type: Sequelize.ENUM('next_node', 'url', 'api_call'),
        allowNull: false,
        defaultValue: 'next_node'
    },
    next_node_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
            model: WorkflowNode,
            key: 'id'
        }
    },
    order_position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    tableName: 'node_buttons',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

NodeButton.belongsTo(WorkflowNode, { foreignKey: 'node_id' });

await NodeButton.sync();
export default NodeButton;