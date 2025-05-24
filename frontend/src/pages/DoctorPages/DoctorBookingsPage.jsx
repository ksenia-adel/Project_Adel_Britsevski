import { useEffect, useState } from 'react';
// functions to get and cancel doctor bookings
import { getDoctorBookings, cancelBooking } from '../../api/booking';
import '../../styles/styles.css';

// main component for displaying and managing doctor's bookings
export default function DoctorBookingsPage() {
  // store bookings data
  const [bookings, setBookings] = useState([]);
  // store error messages
  const [error, setError] = useState('');
  // store loading state to show a spinner while fetching data
  const [loading, setLoading] = useState(true);

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

  // function to cancel a booking
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      // remove cancelled booking from the list
      setBookings((prev) => prev.filter((b) => b.bookingid !== id));
    } catch {
      setError('Failed to cancel booking.');
    }};

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
              onClick={() => handleDelete(booking.bookingid)}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
