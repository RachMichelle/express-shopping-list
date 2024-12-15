const express = require('express');
const items = require('./fakeDb');
const CustomError = require('./error')
const router = new express.Router();


router.get('/', (req, res) => {
    return res.json({ items });
})

router.get('/:name', (req, res) => {
    let item = items.find(i => i.name === req.params.name);
    if (item === undefined) {
        throw new CustomError('Item Not Found', 404);
    }
    return res.json({ item });
})

router.post('/', (req, res) => {
    let newItem = { name: req.body.name, price: req.body.price };
    if (!newItem.name || !newItem.price) {
        throw new CustomError('Missing information: name and price required', 400);
    }
    items.push(newItem);
    return res.status(201).json({ added: newItem });
})

router.patch('/:name', (req, res) => {
    let toUpdate = items.find(i => i.name === req.params.name);
    if (toUpdate === undefined) {
        throw new CustomError('Item Not Found', 404)
    }

    toUpdate.name = req.body.name || toUpdate.name;
    toUpdate.price = req.body.price || toUpdate.price;

    return res.status(200).json({ updated: toUpdate });
})

router.delete('/:name', (req, res) => {
    let idx = items.findIndex(i => i.name === req.params.name);
    if (idx !== -1) {
        items.splice(idx, 1);
        return res.json({ message: 'Deleted' })
    } else {
        throw new CustomError('Item Not Found', 404);
    }
})

module.exports = router;