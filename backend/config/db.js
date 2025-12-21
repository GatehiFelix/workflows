import  Sequelize  from "sequelize";
import dotenv from "dotenv";
import 'colors'

dotenv.config();

const connectDB = async () => {
    try {
         const sequelize = new Sequelize(process.env.MYSQL_URI, {
            dialect: 'mysql',
            logging: false,
            timezone: process.env.NODE_ENV === 'production' ? '+00:00' : '-05:00',
         });
         await sequelize.sync();
         await sequelize.authenticate();
         console.log('MySQL Database connected successfully'.cyan.underline);   
         return sequelize;
    } catch (err) {
        console.error(`Error: ${err.message}`.red.bold);
        process.exit(1);
    }
}

export default connectDB;