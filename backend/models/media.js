import Sequelize from 'sequelize';
import connectDB from '../config/db.js';

import Chat from './chats.js';

const sequelize = await connectDB();

const Media = sequelize.define('Media', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }, 
    chat_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: Chat,
            key: 'id'
        }
    },
    file_url: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    file_type: {
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
    tableName: 'media',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})

Media.belongsTo(Chat, { foreignKey: 'chat_id' });

await Media.sync();
export default Media;