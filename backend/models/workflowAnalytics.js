import  Sequelize  from 'sequelize';
import connectDB from '../config/db';

const sequelize = connectDB();


const WorkflowAnalytics = sequelize.define(
  'WorkflowAnalytics',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workflow_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'workflows',
        key: 'id',
      },
    },
    chat_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'chats',
        key: 'id',
      },
    },
    node_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'workflow_nodes',
        key: 'id',
      },
    },
    event_type: {
      type: Sequelize.ENUM(
        'workflow_started',
        'workflow_completed',
        'node_entered',
        'node_completed',
        'transition_taken',
        'error'
      ),
      allowNull: false,
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
    }
  },
  {
    tableName: 'workflow_analytics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default WorkflowAnalytics;