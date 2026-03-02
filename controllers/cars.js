const Car = require('../models/Car');
const Provider = require('../models/Provider');

// @desc    Get cars
// @route   GET /api/v1/cars
// @route   GET /api/v1/providers/:providerId/cars
// @access  Public  
exports.getCars = async (req, res, next) => {
    let query;

    if(req.params.providerId){
        query = Car.find({provider: req.params.providerId}).populate({
            path: 'provider',
            select: 'name address tel'
        })
    }else{
        query = Car.find().populate({
            path: 'provider',
            select: 'name address tel'
        })
    }
    try{
        const car = await query;

        res.status(200).json({
            success: true,
            count: car.length,
            data: car
        });
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot find Cars'});
    }
};

// @desc    Get single car  
// @route   GET /api/v1/cars/:id
// @access  Public  
exports.getCar = async (req, res, next) => {
    try{
        const car = await Car.findById(req.params.id).populate({
            path: 'provider',
            select: 'name address tel'
        });

        if(!car){
            return res.status(404).json({success: false, message: `No car with the id of ${req.params.id}`});
        }
        res.status(200).json({success: true, data: car});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot find Car'});
    }
};

// @desc    Add car
// @route   POST /api/v1/providers/:providerId/cars
// @access  Private  
exports.createCar = async (req, res, next) => {
    req.body.provider = req.params.providerId;
    try{
        const provider = await Provider.findById(req.params.providerId);
        if(!provider){
            return res.status(404).json({success: false, message: `No provider with the id of ${req.params.providerId}`});
        }
        const car = await Car.create(req.body);

        res.status(201).json({success: true, data: car});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot add Car'});
    }
};

// @desc    Update car
// @route   PUT /api/v1/cars/:id
// @access  Private  
exports.updateCar = async (req, res, next) => {
    try{
        let car = await Car.findById(req.params.id);
        if(!car){
            return res.status(404).json({success: false, message: `No car with the id of ${req.params.id}`});
        } 
        car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({success: true, data: car});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot update Car'});
    }
};

// @desc    Delete car
// @route   DELETE /api/v1/cars/:id
// @access  Private  
exports.deleteCar = async (req, res, next) => {
    try{
        const car = await Car.findById(req.params.id);  
        if(!car){
            return res.status(404).json({success: false, message: `No car with the id of ${req.params.id}`});
        }
        await car.remove();
        res.status(200).json({success: true, data: {}});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot delete Car'});
    } 
};