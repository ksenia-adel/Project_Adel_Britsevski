import { useEffect, useState } from 'react';
import { getAdmins,
         createAdmin,
         updateAdmin,
         deleteAdmin, } from '../../api/admin';
import '../../styles/styles.css';
import ConfirmationModal from '../../components/ConfirmationModal';

// main component for admin management
export default function AdminPage() {
  // store the list of admins
  const [admins, setAdmins] = useState([]);
  // store form input values
  const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', phone: '' });
  // store the id of the admin being edited
  const [editingId, setEditingId] = useState(null);
  // store generated password after creating a new admin
  const [generatedPassword, setGeneratedPassword] = useState('');
  // store error messages
  const [error, setError] = useState('');
  // store id of admin to confirm deletion
  const [adminToDelete, setAdminToDelete] = useState(null);

  // load admin list when the component first renders
  useEffect(() => { loadAdmins(); }, []);

  // function to fetch all admins from the server
  const loadAdmins = async () => {
    try {
      const res = await getAdmins();
      setAdmins(res);
    } catch (e) {
      setError('Failed to load admins');
    }};

  // function to handle form submission for creating or updating an admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (editingId) {
        // update an existing admin
        res = await updateAdmin(editingId, formData);
      } else {
        // create a new admin
        res = await createAdmin(formData);
        // check if admin already exists
        if (res.message?.includes('already exists')) {
          setError(res.message);
          return;
        }
        // save the generated password
        setGeneratedPassword(res?.login?.password || '');
      }

      // reset form and reload admin list
      setFormData({ firstname: '', lastname: '', email: '', phone: '' });
      setEditingId(null);
      loadAdmins();
    } catch {
      setError('Something went wrong. Please check the form and try again.');
    }};

  // function to fill the form with data for editing
  const handleEdit = (admin) => {
    setEditingId(admin.adminid);
    setFormData({ firstname: admin.firstname, lastname: admin.lastname, email: admin.email, phone: admin.phone });
    setGeneratedPassword('');
    setError('');
  };

  // function to confirm deletion in modal
  const confirmDelete = async () => {
    try {
      await deleteAdmin(adminToDelete);
      setAdminToDelete(null);
      loadAdmins();
    } catch {
      setError('Failed to delete admin');
    }};

  return (
    <div className="page-container">
      <h2 className="page-title">ADD NEW/ EDIT/ DELETE ADMINS</h2>

      {/* show error message if something goes wrong */}
      {error && <p className="error-message">{error}</p>}
      {/* form to create or update an admin */}
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="First Name" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} required />
        <input placeholder="Last Name" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} required />
        <input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
      </form>
      {/* show the generated password after creating a new admin */}
      {generatedPassword && <p className="password-hint">Generated password: <strong>{generatedPassword}</strong></p>}
      {/* show the list of admins with edit and delete buttons */}
      <ul className="item-list">
        {admins.map((admin) => (
          <li key={admin.adminid} className="item">
            <div>
              <strong>{admin.firstname} {admin.lastname}</strong><br />
              <span>{admin.email}</span><br />
              <small>{admin.phone}</small>
            </div>
            <div>
              <button className="btn btn-secondary" onClick={() => handleEdit(admin)}>Edit</button>
              <button className="btn btn-danger" onClick={() => setAdminToDelete(admin.adminid)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {/* modal confirmation for admin deletion */}
      <ConfirmationModal
        open={!!adminToDelete}
        onCancel={() => setAdminToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
