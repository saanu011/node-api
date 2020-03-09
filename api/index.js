const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const app = express();

var data = (require('../data.json'));

// get past bookings

app.route('/bookinghistory')
	.get(bookingHistory);

// get cabs nearby

app.route('/availableCabs')
	.get(availableCabs);

// request booking from A to B

app.route('/requestingCab')
	.post(requestingCab);



function availableCabs(req, res) {

	var availableAtLocation = CabsAtLocation(req.query.location);

	res.json({"Available Cabs" : availableAtLocation});
}

function CabsAtLocation(location) {

	var availbleAtLocation = data.cabs.filter(cab => {
		// console.log(cab.cabNumber);
		if (cab.currentLocation.toLowerCase() == location.toLowerCase() && !cab.isOccupied)
			return cab
	});	

	return availbleAtLocation;
}


function requestingCab(req, res) {
	var pickupLocation = req.body.pickupLocation;
	var dropLocation = req.body.dropLocation;

	var availableCabs = CabsAtLocation(pickupLocation);

	if (availableCabs) {
		res.json({ "Cab Ready for Pickup" : availableCabs[0].cabNumber })
	} else {
		res.json({ "msg": `No cab near ${pickupLocation}` })
	}
}

function bookingHistory(req, res) {

	var userPhone = req.query.phone;

	var history = [];
	for (var user of data.users) {
		if (user.phone === Number(userPhone)) {
			history = user.bookings;
			break;
		}
	}

	res.json({ "Booking History": history });
}

module.exports = app;