import botService from "../services/botService";
import asyncHandler from "express-async-handler";


  /**
   * @route   POST /api/bots
   * @desc    Create a new bot
   * @access  Private
   */

const createBotController = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;

        if(!name ) {
            return res.status(400).json({ success: false, message: 'bot name is required' });
        }

        const bot  = await botService.createBot(req.user.id, {
            name, 
            description,
        })


        res.status(201).json({ success: true, data: bot });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});



/**
* @route   GET /api/bots
* @desc    Get bots for logged in user
* @access  Private
*/

const getBotsController = asyncHandler(async (req, res) => {
    try {
        const bots = await botService.getBotsByUser(req.user.id);

        res.status(200).json({ success: true, count: bots.length , data: bots });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

/**
 * @route GET/api/bots/:id
 * @desc Get bot by id
 * @access Private
 */
const getBotByIdController = asyncHandler(async (req, res) => {
    try {
        const bot  = await botService.getBotById(req.params.id, req.user.id);

        res.status(200).json({ success: true, data: bot });


    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/**
 * @route PUT/api/bots/:id  
 * @desc Update bot by id
 * @access Private
 */

const updateBotController = asyncHandler(async (req, res) => {
        try {
      const { name, description, is_active } = req.body;
      const updates = {};

      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (is_active !== undefined) updates.is_active = is_active;

      const bot = await botService.updateBot(
        req.params.id,
        req.user.id,
        updates
      );

      res.status(200).json({
        success: true,
        data: bot,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
});


/**
 * @route DELETE/api/bots/:id
 * @desc Delete bot by id
 * @access Private
 */

const deleteBotController = asyncHandler(async (req, res) => {
    await botService.deleteBot(req.params.id, req.user.id);

    res.status(200).json({ success: true, message: 'Bot deleted successfully' });
});


export  {
    createBotController,
    getBotsController,
    getBotByIdController,
    updateBotController,
    deleteBotController,
}

