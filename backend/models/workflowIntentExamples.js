import Sequelize from 'sequelize';

import connectDB from '../config/db.js';
import WorkflowIntent from './workflowIntents.js';

const sequelize = connectDB();

const WorkflowIntentExample = sequelize.define('WorkflowIntentExample', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }, 
    intent_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: WorkflowIntent,
            key: 'id'
        }
    },
    example_text: {
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
    tableName: 'workflow_intent_examples',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})

WorkflowIntentExample.belongsTo(WorkflowNode, { foreignKey: 'intent_id' });

await WorkflowIntentExample.sync();
export default WorkflowIntentExample;