import { Sequelize } from "sequelize";

import connectDB from '../config/db.js';
import Workflow from './workflow.js';

const sequelize = connectDB();

const WorkflowNode = sequelize.define('WorkflowNode', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    workflow_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: Workflow,
            key: 'id'
        }
    },
    node_type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    config: {
        type: Sequelize.JSON,
        allowNull: false
    },
    position: {
        type: Sequelize.JSON,
        allowNull: true
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
    tableName: 'workflow_nodes',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  
})

WorkflowNode.belongsTo(Workflow, { foreignKey: 'workflow_id' });

await WorkflowNode.sync();
export default WorkflowNode;
