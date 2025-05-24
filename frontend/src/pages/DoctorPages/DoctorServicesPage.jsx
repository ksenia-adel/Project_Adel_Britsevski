import { useEffect, useState } from 'react';
// API functions for managing doctor's services
import { getMyDoctorServices,
         linkDoctorService,
         unlinkDoctorService, } from '../../api/doctorservices';
import { getServices } from '../../api/service';
import '../../styles/styles.css';

// main component for linking and unlinking services to a doctor
export default function DoctorServicesPage() {
  // store list of services linked to the doctor
  const [linkedServices, setLinkedServices] = useState([]);
  // store list of all available services
  const [allServices, setAllServices] = useState([]);
  // store selected service ID from dropdown
  const [selectedServiceId, setSelectedServiceId] = useState('');
  // store error message
  const [error, setError] = useState('');
  // store success message
  const [success, setSuccess] = useState('');

  // load services when the component first renders
  useEffect(() => {
    loadServices();
  }, []);

  // function to fetch both linked and all services
  const loadServices = async () => {
    try {
      const [linked, all] = await Promise.all([
        getMyDoctorServices(),
        getServices(),
      ]);
      setLinkedServices(linked);
      setAllServices(all);
    } catch (err) {
      setError('Failed to load services');
    }};

  // function to link a selected service to the doctor
  const handleLink = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await linkDoctorService(selectedServiceId);
      // show error if service is already linked
      if (res.message?.includes('already')) {
        setError(res.message);
        return;
      }
      setSuccess('Service linked successfully');
      setSelectedServiceId('');
      loadServices();
    } catch {
      setError('Error linking service');
    }};

  // function to unlink a service from the doctor
  const handleUnlink = async (id) => {
    try {
      await unlinkDoctorService(id);
      loadServices();
    } catch {
      setError('Error unlinking service');
    }};

  return (
    <div className="page-container">
      <h2 className="page-title">MY SERVICES</h2>

      {/* show error and success messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="password-hint">{success}</div>}

      {/* dropdown to select and link a new service */}
      <div className="form">
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="form-select"
          style={{ flex: '1 1 250px', padding: '0.6rem', borderRadius: '6px' }}
        >
          <option value="">-- Select service to add --</option>
          {allServices.map((s) => (
            <option key={s.servicecatalogid} value={s.servicecatalogid}>
              {s.name} – €{s.price}
            </option>
          ))}
        </select>
        <button
          onClick={handleLink}
          disabled={!selectedServiceId}
          className="btn btn-primary"
        >
          Add Service
        </button>
      </div>

      {/* list of services currently linked to the doctor */}
      <ul className="item-list">
        {linkedServices.map((s) => {
          // fallback in case service data is nested differently
          const service = s.ServiceCatalog || s.service || {};
          return (
            <li key={s.doctorserviceid} className="item">
              <span>
                <strong>{service.name || '–'}</strong> — {service.description || 'No description'} — €{service.price || '–'}
              </span>
              <button
                onClick={() => handleUnlink(s.doctorserviceid)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
