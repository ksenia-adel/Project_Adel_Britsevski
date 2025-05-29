import { useEffect, useState } from 'react';
import { getPatients,
         updatePatient,
         deletePatient, } from '../../api/patient';
import '../../styles/styles.css';
import ConfirmationModal from '../../components/ConfirmationModal';

// main component for managing patients
export default function ManagePatientsPage() {
  // store the list of patients
  const [patients, setPatients] = useState([]);
  // store the id of the patient being edited
  const [editingId, setEditingId] = useState(null);
  // store form input values
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    personalcode: '',
    address: '',
  });
  // store error messages
  const [error, setError] = useState('');
  // store id of patient to confirm deletion
  const [patientToDelete, setPatientToDelete] = useState(null);
  // load patient list when the component first renders
  useEffect(() => {
    loadPatients();
  }, []);

  // function to fetch all patients from the server
  const loadPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res);
    } catch (err) {
      setError('Failed to load patients');
    }};

  // function to fill the form with patient data for editing
  const handleEdit = (p) => {
    setEditingId(p.patientid);
    setFormData({
      firstname: p.firstname,
      lastname: p.lastname,
      email: p.user?.email || '',
      phone: p.phone,
      personalcode: p.personalcode,
      address: p.address,
    });
  };

  // function to handle form submission to update a patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(editingId, formData);
      // reset form and reload patients
      setEditingId(null);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        personalcode: '',
        address: '',
      });
      loadPatients();
    } catch {
      setError('Failed to update patient');
    }};

  // function to confirm deletion in modal
  const confirmDelete = async () => {
    try {
      await deletePatient(patientToDelete);
      setPatientToDelete(null);
      loadPatients();
    } catch {
      setError('Failed to delete patient');
    }};

  return (
    <div className="page-container">
      <h2 className="page-title">EDIT/ DELETE PATIENTS</h2>
      {/* show error message if something goes wrong */}
      {error && <p className="error-message">{error}</p>}
      {/* show form only when editing a patient */}
      {editingId && (
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
            placeholder="Personal Code"
            value={formData.personalcode}
            onChange={(e) => setFormData({ ...formData, personalcode: e.target.value })}
          />
          <input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" onClick={() => setEditingId(null)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}
      {/* show list of patients */}
      <ul className="item-list">
        {patients.map((p) => (
          <li key={p.patientid} className="item">
            <span>
              <strong>{p.firstname} {p.lastname}</strong> — {p.user?.email}<br />
              <small>{p.phone} — {p.personalcode}, {p.address}</small>
            </span>
            <div>
              {/* buttons to edit or delete a patient */}
              <button onClick={() => handleEdit(p)} className="btn btn-secondary">Edit</button>
              <button onClick={() => setPatientToDelete(p.patientid)} className="btn btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {/* modal confirmation for patient deletion */}
      <ConfirmationModal
        open={!!patientToDelete}
        onCancel={() => setPatientToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
