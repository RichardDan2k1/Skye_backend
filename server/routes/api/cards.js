const express =  require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Card = require('../../models/cards');
const List = require('../../models/list');


//@route get api/cards/test
//@desc test cards
//@access public

router.get('/test',(req,res) => res.json({msg:'cards work'}));

module.exports = router;


router.post('/',[check('title', 'Title is required').not().isEmpty()],
async(req,res) =>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
}
try {
    const { title, listId } = req.body;

    //create and save card 

    const newCard = new Card({ title });
    const card = await newCard.save();

    //assign card to list 

    const list = await List.findById(listId);
      list.cards.push(card.id);
      await list.save();

      res.json({cardId: card.id, listId});
      return res.statue(200).json({msg: 'cards added'});
}
catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

  // Get all of a list's cards
router.get('/listCards/:listId', async (req, res) => {
    try {
      const list = await List.findById(req.params.listId);
      if (!list) {
        return res.status(404).json({ msg: 'List not found' });
      }
  
      const cards = [];
      for (const cardId of list.cards) {
        cards.push(await List.findById(cardId));
      }
  
      res.json(cards);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Get a card by id
  router.get('/:id', async (req, res) => {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).json({ msg: 'Card not found' });
      }
  
      res.json(card);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Edit a card's title
  router.patch('/edit/:id', async (req, res) => {
    try {
      const { title, description, label } = req.body;
      if (title === '') {
        return res.status(400).json({ msg: 'Title is required' });
      }
  
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).json({ msg: 'Card not found' });
      }
  
      card.title = title ? title : card.title;
      if (description || description === '') {
        card.description = description;
      }
      if (label || label === 'none') {
        card.label = label;
      }
      await card.save();
  
      res.json(card);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Delete a card
router.delete('/:listId/:id', async (req, res) => {
    try {
      const card = await Card.findById(req.params.id);
      const list = await List.findById(req.params.listId);
      if (!card || !list) {
        return res.status(404).json({ msg: 'List/card not found' });
      }
  
      list.cards.splice(list.cards.indexOf(req.params.id), 1);
      await list.save();
      await card.remove();
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
});