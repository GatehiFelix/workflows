import { Sequelize } from 'sequelize';
import connectDB from '../config/db.js';
import Workflow from './workflow.js';

const sequelize = await connectDB();

const WorkflowTrigger = sequelize.define('WorkflowTrigger', {
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
    trigger_type: {
        type: Sequelize.ENUM('keyword', 'regex', 'intent', 'greeting'),
        allowNull: false
    },
    pattern: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    priority: {
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
    tableName: 'workflow_triggers',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

WorkflowTrigger.belongsTo(Workflow, { foreignKey: 'workflow_id' });

await WorkflowTrigger.sync();
export default WorkflowTrigger;