const Car = require('../models/Car');
const Provider = require('../models/Provider');

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