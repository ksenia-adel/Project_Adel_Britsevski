import { useEffect, useState } from 'react';
import { getServices,
         createService,
         updateService,
         deleteService, } from '../../api/service';
import '../../styles/styles.css';
import ConfirmationModal from '../../components/ConfirmationModal';

// main component for managing service catalog
export default function ServiceCatalogPage() {
  // store the list of services
  const [services, setServices] = useState([]);
  // store form input values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });
  // store the id of the service being edited
  const [editingId, setEditingId] = useState(null);
  // store error messages
  const [error, setError] = useState('');
  // store id of service to confirm deletion
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // load services when the component first renders
  useEffect(() => {
    loadServices();
  }, []);

  // function to fetch all services from the server
  const loadServices = async () => {
    try {
      const res = await getServices();
      setServices(res);
    } catch (e) {
      setError('Failed to load services');
    }};

  // function to handle form submission for creating or updating a service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (editingId) {
        // update existing service
        res = await updateService(editingId, formData);
      } else {
        // create a new service
        res = await createService(formData);}

      // show error if the service already exists
      if (res.message?.includes('exists')) {
        setError(res.message);
        return;}

      // reset form and reload services
      setFormData({ name: '', description: '', price: '', duration: '' });
      setEditingId(null);
      loadServices();
    } catch {
      setError('Error saving service');
    }};

  // function to fill the form with service data for editing
  const handleEdit = (s) => {
    setEditingId(s.servicecatalogid);
    setFormData({
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration,
    });
  };

  // function to confirm deletion in modal
  const confirmDelete = async () => {
    try {
      await deleteService(serviceToDelete);
      setServiceToDelete(null);
      loadServices();
    } catch {
      setError('Error deleting service');
    }};

  return (
    <div className="page-container">
      <h2 className="page-title">ADD NEW/ EDIT/ DELETE SERVICES</h2>
      {/* show error message if something goes wrong */}
      {error && <p className="error-message">{error}</p>}
      {/* form for creating or updating a service */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          placeholder="Duration (minutes)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          required
        />
        <input
          placeholder="Price (€)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>
      {/* show list of all services */}
      <ul className="item-list">
        {services.map((s) => (
          <li key={s.servicecatalogid} className="item">
            <span>
              <strong>{s.name}</strong> — {s.description || 'No description'} — {s.duration} min — €{s.price}
            </span>
            <div>
              {/* buttons to edit or delete a service */}
              <button className="btn btn-secondary" onClick={() => handleEdit(s)}>Edit</button>
              <button className="btn btn-danger" onClick={() => setServiceToDelete(s.servicecatalogid)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {/* modal confirmation for service deletion */}
      <ConfirmationModal
        open={!!serviceToDelete}
        onCancel={() => setServiceToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
