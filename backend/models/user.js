import  Sequelize  from 'sequelize';
import bcrypt from 'bcryptjs';

import connectDB from '../config/db.js';

const sequelize = connectDB();

const User = sequelize.define('User', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique: true,
        trim: true,
        lowerCase: true,
        validate: {
            isEmail: true
        }
    },
    email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    remember_token: {
        type: Sequelize.STRING,
        allowNull: true
    },
    role: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
},{
    tableName: 'users',
    timestamps: true,
    createdAt: "created_at",
    updatedAt:"updated_at",
    hooks: {
        beforeSave: async (user) => {
            if(user.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

User.prototype.matchPassword = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error(error)
    }
}

export default User;