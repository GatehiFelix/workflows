import Sequelize from 'sequelize';

import connectDB from '../config/db.js';
import Workflow from './workflow.js';

const sequelize = connectDB();

const WorkflowIntent = sequelize.define('WorkflowIntent', {
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
    intent_name: {
        type: Sequelize.STRING,
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
    tableName: 'workflow_intents',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

WorkflowIntent.belongsTo(Workflow, { foreignKey: 'workflow_id' });

await WorkflowIntent.sync();
export default WorkflowIntent;