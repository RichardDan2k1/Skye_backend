const express =  require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator');

const User = require('../../models/User');
const List = require('../../models/list');

//@route get api/lists/test
//@desc test lists
//@access public

router.get('/test',(req,res) => res.json({msg:'lists work'}));


//add a list

router.post('/',[check('title', 'Title is required').not().isEmpty()],
async(req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const title = req.body.title;
        const newList = new List({title});
        const list = await newList.save();
        res.status(200).json({msg: 'List created'});
    }

    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get a list by id

router.get('/:id',async(req,res)=> {
    try{
        const list = await List.findByID(req.params.id);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
          }
      
          res.json(list);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      
});

router.patch('/rename/:id',
    [[check('title', 'Title is required').not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const list = await List.findById(req.params.id);
        if (!list) {
          return res.status(404).json({ msg: 'List not found' });
        }
  
        list.title = req.body.title;
        await list.save();
  
        res.json(list);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );







module.exports = router;
