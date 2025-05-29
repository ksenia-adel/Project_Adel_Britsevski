import { useEffect, useState } from 'react';
import { getMyBookings,
         cancelBooking,
         payBooking, } from '../../api/booking';
import '../../styles/styles.css';
import ConfirmationModal from '../../components/ConfirmationModal';

// main component for showing and managing user’s own bookings
export default function MyBookingsPage() {
  // store user's bookings
  const [bookings, setBookings] = useState([]);
  // store status or error message
  const [message, setMessage] = useState('');
  // store booking id to confirm cancellation
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // load bookings when the component is first rendered
  useEffect(() => {
    loadBookings();
  }, []);

  // function to fetch user's bookings from the server
  const loadBookings = async () => {
    const res = await getMyBookings();
    setBookings(res);
  };

  // function to confirm cancellation in modal
  const confirmCancel = async () => {
    const res = await cancelBooking(bookingToCancel);
    setMessage(res.message || 'Cancelled');
    setBookingToCancel(null);
    loadBookings();
  };

  // function to mark a booking as paid
  const handlePay = async (id) => {
    const res = await payBooking(id);
    setMessage(res.message || 'Payment complete');
    loadBookings();
  };

  return (
    <div className="page-container">
      <h2 className="page-title">MY BOOKINGS</h2>

      {/* show feedback message after an action */}
      {message && (
        <div className={message.includes('Payment') || message.includes('Paid') ? 'password-hint' : 'error-message'}>
          {message}
        </div>
      )}
      {/* show message if there are no bookings */}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        // show list of bookings
        <ul className="item-list">
          {bookings.map((b) => (
            <li key={b.bookingid} className="item">
              <p><strong>{b.serviceInfo?.name || 'Unknown Service'}</strong> — €{b.serviceInfo?.price ?? '??'}</p>
              <p>Dr. {b.scheduleSlot?.doctor?.firstname} {b.scheduleSlot?.doctor?.lastname}</p>
              <p>{b.scheduleSlot?.date} — {b.scheduleSlot?.starttime}–{b.scheduleSlot?.endtime}</p>

              <div className="form-buttons">
                {/* show paid status or pay button */}
                {b.ispaid ? (
                  <span className="paid-status" style={{ color: 'green', fontWeight: 'bold' }}>✔ Paid</span>
                ) : (
                  <button onClick={() => handlePay(b.bookingid)} className="btn btn-primary">
                    Pay
                  </button>
                )}
                {/* cancel booking button */}
                <button onClick={() => setBookingToCancel(b.bookingid)} className="btn btn-danger">
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* modal confirmation for booking cancellation */}
      <ConfirmationModal
        open={!!bookingToCancel}
        onCancel={() => setBookingToCancel(null)}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
