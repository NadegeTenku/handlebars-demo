const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');

const initialiseDb = require('./initialiseDb');
initialiseDb();

const app = express();
const port = 3000;



app.use(express.static('public'));

app.use(express.json());

// handlebars configuration to work with express & sequelize model
const handlebars = expressHandlebars({
    handlebars : allowInsecurePrototypeAccess(Handlebars)
})

//let this express app know that we're using handlebars
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars')


    // await sequelize.sync({ force: true});

const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]
//res.render helps us to connect with hanldebars where res.render is the view engine
app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    //2 arguuments where 1- name of template file name & 2- name of the data you are passing.
    res.render("restaurants", { restaurants });
});

app.get('/restaurants/:id', async (req, res) => {
    //const restau is the variable made to look for restau by Pk
    const restaurants = await Restaurant.findAll();
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.render("restaurant", {restaurant, restaurants});
});

app.post('/restaurants', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Restaurant.create(req.body);
    res.sendStatus(201);
});

app.delete('/restaurants/:id', async (req, res) => {
    await Restaurant.destroy({
        where: {
            id: req.params.id
        }
    });
    res.sendStatus(200);
});

app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.patch('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});