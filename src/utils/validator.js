/* Duren Gouda
B00949586 */

// this is a validation function, triggers if user put invalid credentials or any fields left empty!!
function validateBooking(booking) {
    const { userName, roomType, checkInDate, checkOutDate } = booking;
  
    if (!userName || !roomType || !checkInDate || !checkOutDate) {
      return { isValid: false, message: 'All fields are required.' };
    }
  
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return { isValid: false, message: 'Check-in date must be before check-out date.' };
    }
  
    return { isValid: true };
  }
  
  module.exports = { validateBooking };