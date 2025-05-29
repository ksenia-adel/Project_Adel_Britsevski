import { useEffect, useState } from 'react';
import { getMySchedule, createSlot, deleteSlot } from '../../api/schedule';
import '../../styles/styles.css';
import ConfirmationModal from '../../components/ConfirmationModal';

// main component for managing doctor's schedule
export default function DoctorSchedulePage() {
  // store the list of schedule slots
  const [schedule, setSchedule] = useState([]);
  // store form input values
  const [formData, setFormData] = useState({
    date: '',
    starttime: '',
    endtime: '',
  });
  // store error messages
  const [error, setError] = useState('');
  // store id of slot to confirm deletion
  const [slotToDelete, setSlotToDelete] = useState(null);

  // load schedule when the component first renders
  useEffect(() => {
    loadSchedule();
  }, []);

  // function to fetch the doctor's schedule from the server
  const loadSchedule = async () => {
    try {
      const res = await getMySchedule();
      setSchedule(res);
    } catch (err) {
      setError('Failed to load schedule');
    }};

  // function to handle form submission and create a new slot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await createSlot(formData);
      // check if the server returned an error
      if (res.error || res.message?.includes('Failed')) {
        setError(res.message);
        return;
      }
      // reset form and reload schedule
      setFormData({ date: '', starttime: '', endtime: '' });
      loadSchedule();
    } catch {
      setError('Failed to create slot');
    }};

  // function to confirm deletion in modal
  const confirmDelete = async () => {
    try {
      await deleteSlot(slotToDelete);
      setSlotToDelete(null);
      loadSchedule();
    } catch {
      setError('Failed to delete slot');
    }};

  return (
    <div className="page-container">
      <h2 className="page-title">MY SCHEDULE</h2>
      {/* show error message if something goes wrong */}
      {error && <div className="error-message">{error}</div>}
      {/* form to add a new schedule slot */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <input
          type="time"
          step="60"
          value={formData.starttime}
          onChange={(e) => setFormData({ ...formData, starttime: e.target.value })}
          required
        />
        <input
          type="time"
          step="60"
          value={formData.endtime}
          onChange={(e) => setFormData({ ...formData, endtime: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">Add Slot</button>
      </form>
      {/* show list of schedule slots */}
      <ul className="item-list">
        {schedule.map((slot) => (
          <li key={slot.scheduleid} className="item">
            <span>{slot.date}: {slot.starttime} – {slot.endtime}</span>
            <button onClick={() => setSlotToDelete(slot.scheduleid)} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
      {/* modal confirmation for slot deletion */}
      <ConfirmationModal
        open={!!slotToDelete}
        onCancel={() => setSlotToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
