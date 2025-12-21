import { Sequelize } from "sequelize";
import connectDB from "../config/db.js";
import WorkflowNode from "./workflowNodes.js";

const sequelize = connectDB();

const NodeTransition = sequelize.define(
    "NodeTransition",
    {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        from_node_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: WorkflowNode,
                key: "id",
            },
        },
        to_node_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: WorkflowNode,
                key: "id",
            },
        },
        intent_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        trigger_type: {
            type: Sequelize.ENUM("message", "event", "condition"),
            allowNull: false,
        },
        trigger_value: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        condition: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        priority: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "node_transitions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

NodeTransition.belongsTo(WorkflowNode, { foreignKey: "from_node_id", as: "FromNode" });
NodeTransition.belongsTo(WorkflowNode, { foreignKey: "to_node_id", as: "ToNode" });

await NodeTransition.sync();
export default NodeTransition;