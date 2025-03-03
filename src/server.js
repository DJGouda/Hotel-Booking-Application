/* Duren Gouda
B00949586 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOMS_FILE = path.join(__dirname, '../data/rooms.json');
const BOOKINGS_FILE = path.join(__dirname, '../data/bookings.json');

// this function will read the room data, I have kept in both server.js and filehandler.js so that no error will occur!!!
function readRooms(callback) {
  fs.readFile(ROOMS_FILE, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, JSON.parse(data));
  });
}

// Helper function to save booking data
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

// this is the main server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/') {
    fs.readFile(path.join(__dirname, '../public/index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }

  // for room search
  else if (parsedUrl.pathname === '/search') {
    const roomType = parsedUrl.query.roomType;
    const minPrice = parseFloat(parsedUrl.query.minPrice);
    const maxPrice = parseFloat(parsedUrl.query.maxPrice);

    readRooms((err, rooms) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read room data' }));
        return;
      }

      // Filtering rooms by type and price range
      let filteredRooms = rooms;
      if (roomType) {
        filteredRooms = filteredRooms.filter(room => room.type === roomType);
      }
      if (!isNaN(minPrice)) {
        filteredRooms = filteredRooms.filter(room => room.price >= minPrice);
      }
      if (!isNaN(maxPrice)) {
        filteredRooms = filteredRooms.filter(room => room.price <= maxPrice);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(filteredRooms));
    });
  }

  // Handling room details
  else if (parsedUrl.pathname.startsWith('/room/')) {
    const roomId = parseInt(parsedUrl.pathname.split('/')[2], 10);
    readRooms((err, rooms) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read room data' }));
        return;
      }
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(room));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Room not found' }));
      }
    });
  }

  // Handling booking submissions 
  else if (parsedUrl.pathname === '/book' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const bookingData = JSON.parse(body);
      saveBooking(bookingData, (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to save booking' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Booking saved successfully' }));
      });
    });
  }

  // this will handle the invalid routes
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});