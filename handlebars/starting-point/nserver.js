//Express 
const express = require('express');
const app = express();
const PORT = 3000;

//Handlebars
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access') 


//Import our database and model
const {sequelize} = require('./db');
const Restaurant = require('./models/restaurant');
// const Menu = require('./models/menu');
// const MenuItem = require('./models/menuItem');


//Set up our templating engine with handlebars
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars'); // To render template files, set the following application setting properties, set in app.js in the default app created by the generator:

//serve static assets from public folder
app.use(express.static('public'))

// //allow express to read json request bodies
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//*************** ROUTES ******************//

//New Routes go here: 
app.get('/new-restaurant', async (req, res) => {
    res.render('newRestaurantForm')
})


//index redirects to restos
app.get('/', (req,res) => {
    res.redirect('/nRestaurants')
})


//get all restos
app.get('/nRestaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('nRestaurants', {restaurants}); //first param points to the restaurants view in handlebars, second param is the data from the db
})


//get resto by id
app.get('/nRestaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    res.render('nRestaurant', {restaurant}); //resto hb view
})


//Update resto by id
app.put('/nRestaurants/:id', async (req,res) => {
    let updatedRestaurant = await Restaurant.update(req.body, {
        where: {id: req.params.id}
    })
    const restaurant = await Restaurant.findByPk(req.params.id);
    res.render('nRestaurant', {restaurant})
})


//post route triggered by form submit action
app.post('/new-restaurant', async (req, res) => {
    const newRestaurant = await Restaurant.create(req.body)  //add resto to db based on html form data
    let restaurantAlert = `${newRestaurant.name} created and added to database`  //create a restoAlert to pass to the template
    const foundRestaurant = await Restaurant.findByPk(newRestaurant.id)  //find newRestaurant in db by id
    if(foundRestaurant){
        res.render('newRestaurantForm',{restaurantAlert})
    } else {
        restaurantAlert = 'Failed to add Restaurant'
        res.render('newRestaurantForm',{restaurantAlert})
    } 
})


//DELETE method, resto/:id path => Deletes a resto from db.sqlite
app.delete('/nRestaurants/:id', async (req,res) => {
    const deletedRestaurant = await Restaurant.destroy({
        where: {id:req.params.id}
    })
    res.send(deletedRestaurant ? 'Deleted' : 'Deletion Failed')
    // if(deletedRestaurant){
    //     res.render('BACK',{deleteAlert})
    // } else {
    //     deleteAlert = 'Delete not allowed'
    //     res.render('BACK',{deleteAlert})
    // } 
})

//server is now listening to PORT
app.listen(PORT, () => {
    console.log(`Your server is now listening to port ${PORT}`)
})