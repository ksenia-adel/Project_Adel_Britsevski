import { useEffect, useState } from 'react';
import { getDoctorBookings, cancelBooking } from '../../api/booking';
import '../../styles/styles.css';
import ConfirmationModal from '../../components/ConfirmationModal';

// main component for displaying and managing doctor's bookings
export default function DoctorBookingsPage() {
  // store bookings data
  const [bookings, setBookings] = useState([]);
  // store error messages
  const [error, setError] = useState('');
  // store loading state to show a spinner while fetching data
  const [loading, setLoading] = useState(true);
  // store id of booking to confirm cancellation
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // load bookings when the component first renders
  useEffect(() => {
    fetchBookings();
  }, []);

  // function to fetch bookings from the server
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getDoctorBookings();
      // check if response is an array
      if (!Array.isArray(data)) {
        setError(data.message || 'Unexpected response');
        setBookings([]);
      } else {
        setBookings(data);
      }
    } catch (err) {
      setError('Failed to load bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // function to confirm cancellation in modal
  const confirmCancel = async () => {
    try {
      await cancelBooking(bookingToCancel);
      setBookings((prev) => prev.filter((b) => b.bookingid !== bookingToCancel));
      setBookingToCancel(null);
    } catch {
      setError('Failed to cancel booking.');
    }
  };

  // function to format time (e.g., "14:30:00" -> "14:30")
  const formatTime = (t) => t?.slice(0, 5);

  return (
    <div className="page-container">
      <h2 className="page-title">MY BOOKINGS</h2>

      {/* show spinner while data is loading */}
      {loading && <div className="spinner"></div>}

      {/* show error message if something goes wrong */}
      {error && <div className="error-message">{error}</div>}

      {/* show message when there are no bookings */}
      {!loading && bookings.length === 0 && (
        <p>No bookings yet.</p>
      )}

      {/* list of bookings */}
      <ul className="item-list">
        {bookings.map((booking) => (
          <li key={booking.bookingid} className="item">
            <div>
              🗓 <strong>{booking.scheduleSlot?.date}</strong> at {formatTime(booking.scheduleSlot?.starttime)}<br />
              Patient: {booking.patient?.firstname} {booking.patient?.lastname}<br />
              Service: {booking.serviceInfo?.name}
            </div>
            {/* cancel button for each booking */}
            <button
              className="btn btn-danger"
              onClick={() => setBookingToCancel(booking.bookingid)}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>

      {/* modal confirmation for booking cancellation */}
      <ConfirmationModal
        open={!!bookingToCancel}
        onCancel={() => setBookingToCancel(null)}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
