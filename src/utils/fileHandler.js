/* Duren Gouda
B00949586 */

const fs = require('fs');
const path = require('path');

const ROOMS_FILE = path.join(__dirname, '../../data/rooms.json');
const BOOKINGS_FILE = path.join(__dirname, '../../data/bookings.json');

// this function will parse and read all the rooms
function readRooms(callback) {
  fs.readFile(ROOMS_FILE, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, JSON.parse(data));
  });
}

// tis funtinon will save the booked room in the bookings.json file
function saveBooking(booking, callback) {
  fs.readFile(BOOKINGS_FILE, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    const bookings = JSON.parse(data);
    bookings.push(booking);
    fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
  });
}

module.exports = { readRooms, saveBooking };