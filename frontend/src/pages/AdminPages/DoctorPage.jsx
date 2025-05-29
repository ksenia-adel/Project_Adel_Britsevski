import { useEffect, useState } from 'react';
import { getDoctors,
         createDoctor,
         updateDoctor,
         deleteDoctor, } from '../../api/doctor';
import ConfirmationModal from '../../components/ConfirmationModal';
import '../../styles/styles.css';

// main component for managing doctors
export default function DoctorPage() {
  // store the list of doctors
  const [doctors, setDoctors] = useState([]);
  // store form input values
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    specialty: '',
  });
  // store the id of the doctor being edited
  const [editingId, setEditingId] = useState(null);
  // store generated password after creating a new doctor
  const [generatedPassword, setGeneratedPassword] = useState('');
  // store error messages
  const [error, setError] = useState('');
  // get the current user's role from local storage
  const role = localStorage.getItem('role');
  // store id of doctor to confirm deletion
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // load doctor list when the component first renders
  useEffect(() => {
    loadDoctors();
  }, []);

  // function to fetch all doctors from the server
  const loadDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res);
    } catch (e) {
      setError('Failed to load doctors');
    }
  };

  // function to handle form submission for creating or updating a doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGeneratedPassword('');

    try {
      let res;
      if (editingId) {
        // update an existing doctor
        res = await updateDoctor(editingId, formData);
      } else {
        // create a new doctor
        res = await createDoctor(formData);
      }

      // show error if doctor already exists or any error occurred
      if (!res || res.error || res.message?.toLowerCase().includes('already')) {
        setError(res.message || res.error || 'Something went wrong.');
        return;
      }

      // if creating a new doctor, show generated password
      if (!editingId) {
        setGeneratedPassword(res?.login?.password || '');
      }

      // reset form and reload doctor list
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        specialty: '',
      });
      setEditingId(null);
      loadDoctors();
    } catch (err) {
      setError('Something went wrong while submitting.');
    }
  };

  // function to fill the form with doctor data for editing
  const handleEdit = (doctor) => {
    setEditingId(doctor.doctorid);
    setFormData({
      firstname: doctor.firstname,
      lastname: doctor.lastname,
      email: doctor.email,
      phone: doctor.phone,
      specialty: doctor.specialty,
    });
    setGeneratedPassword('');
    setError('');
  };

  // function to confirm deletion in modal
  const confirmDelete = async () => {
    try {
      const res = await deleteDoctor(doctorToDelete);
      if (res.error || res.message?.toLowerCase().includes('failed')) {
        setError(res.message || res.error || 'Failed to delete doctor');
        return;
      }
      setDoctorToDelete(null);
      loadDoctors();
    } catch (e) {
      setError('Failed to delete doctor');
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">ADD NEW/ EDIT/ DELETE DOCTORS</h2>
      {/* show error message if something goes wrong */}
      {error && <p className="error-message">{error}</p>}
      {/* show form only if the user is an admin */}
      {role === 'admin' && (
        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            required
          />
          <input
            placeholder="Last Name"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <input
            placeholder="Specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {/* show generated password after creating a new doctor */}
      {generatedPassword && (
        <p className="password-hint">
          New Doctor password: <strong>{generatedPassword}</strong>
        </p>
      )}

      {/* show list of doctors */}
      <ul className="item-list">
        {doctors.map((doctor) => (
          <li key={doctor.doctorid} className="item">
            <span>
              <strong>{doctor.firstname} {doctor.lastname}</strong> — {doctor.email}<br />
              <small>{doctor.phone}, {doctor.specialty}</small>
            </span>
            {/* show edit/delete buttons only for admin users */}
            {role === 'admin' && (
              <div>
                <button className="btn btn-secondary" onClick={() => handleEdit(doctor)}>Edit</button>
                <button className="btn btn-danger" onClick={() => setDoctorToDelete(doctor.doctorid)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* modal confirmation for doctor deletion */}
      <ConfirmationModal
        open={!!doctorToDelete}
        onCancel={() => setDoctorToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
