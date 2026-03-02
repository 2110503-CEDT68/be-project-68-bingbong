const Booking = require('../models/Booking');
const Hospital = require('../models/Hospital');

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
    let query;
    //General users can see only their bookings!
    if(req.user && req.user.role !== 'admin'){
        query = Booking.find({user: req.user.id}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
        }else{ //If you are an admin, you can see all bookings
            if(req.params.hospitalId){
                console.log(req.params.hospitalId);
                query = Booking.find({hospital: req.params.hospitalId}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
            }else{
                query = Booking.find().populate({
            path: 'hospital',
            select: 'name province tel'
        });
            }
    }
    try{
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot find Booking'});
    }
};

//@desc Get Single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name province tel'
        });

        if(!booking){
            return res.status(404).json({success: false, message: 'No booking with the id of ' + req.params.id});
        }
        res.status(200).json({success: true, data: booking});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot find Booking'});
    }
};

//@desc Add booking
//@route POST /api/v1/hospitals/:hospitalId/bookings
//@access Private
exports.addBooking = async (req, res, next) => {
    try{
        req.body.hospital = req.params.hospitalId;
    
        const hospital = await Hospital.findById(req.params.hospitalId);
        if(!hospital){
            return res.status(404).json({success: false, message: 'No hospital with the id of ' + req.params.hospitalId});
        }

        //add user to req.body
        req.body.user = req.user.id;
        const existingBooking = await Booking.find({user:req.user.id});
        if(existingBooking.length >= 3){
            return res.status(400).json({success: false, message: `The user ${req.user.name} has already made 3 bookings`});
        }

        const booking = await Booking.create(req.body);
        res.status(200).json({
            success: true,
            data: booking
        });
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot create Booking'});
}
}

// @desc Update booking
// @route PUT /api/v1/bookings/:id
// @access Private
exports.updateBooking = async (req, res, next) => {
    try{
        let booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({success: false, message: 'No booking with the id of ' + req.params.id});
        }

        //Make sure user is booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success: false, message: 'User not authorized to update this booking'});
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({success: true, data: booking});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot update Booking'});
    }
}

// @desc Delete booking
// @route DELETE /api/v1/bookings/:id
// @access Private
exports.deleteBooking = async (req, res, next) => {
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({success: false, message: 'No booking with the id of ' + req.params.id});
        }

        //Make sure user is booking owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success: false, message: 'User not authorized to delete this booking'});
        }

        await booking.deleteOne();
        res.status(200).json({success: true, data: {}});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: 'Cannot delete Booking'});
    }
}
