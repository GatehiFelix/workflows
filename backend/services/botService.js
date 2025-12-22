import Bot from '../models/bot.js';
import Workflow from '../models/workflow.js';

class BotService {
    /**
     * Creates a new bot.
     */
    async createBot(userId, {name, description}) {
        const bot = await Bot.create({
            user_id: userId,
            name,
            description,
            is_active: true,
        });

        return bot;
    }

    /**
     * Gets all bots for a user.
     */
    async getBotsByUser(userId) {
        const bots = await Bot.findAll({
            where: { user_id: userId },
            include: [
                {
                    model : Workflow,
                    attributes: ['id', 'name', 'is_active'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        return bots;
    }

    /**
     * get bot by id
     */
    async getBotById(botId, userId) {
        const bot = await Bot.findOne({
            where: { id: botId, user_id: userId },
            include: [
                {
                    model: Workflow,
                    attributes: ['id', 'name', 'description' , 'is_active'],
                },
            ],
        });

        if(!bot) {
            throw new Error('Bot not found');
        }

        return bot;
    }

        /**
     * Update bot
     */
    async updateBot(botId, userId, updates) { //
        const bot = await Bot.findOne({
            where: { id: botId, user_id: userId },
        });

        if(!bot) {
            throw new Error('Bot not found');
        }

        await bot.update(updates);
        return bot;
    }

    /**
     * delete bot
     */
    async deleteBot(botId, userId) {
        const bot  = await Bot.findOne({
            where: { id: botId, user_id: userId },
        });

        if(!bot) {
            throw new Error('Bot not found');
        }

        await bot.destroy();
        return { message: 'Bot deleted successfully' };
    }

    /**
     * Toggle bot active status
     */
    async toggleBotActiveStatus(botId, userId) {
        const bot  = await Bot.findOne({
            where: { id: botId, user_id: userId },
        });

        if(!bot) {
            throw new Error('Bot not found');
        }

        await bot.update({ is_active: !bot.is_active });
        return bot;
    }
}

export default new BotService();