import { useEffect, useState } from 'react';
// functions to get doctors and their services
import { getDoctors } from '../../api/doctor';
import { getDoctorServicesById } from '../../api/doctorservices';
import '../../styles/styles.css';

// main component for browsing and filtering doctors
export default function FindDoctorPage() {
  // store all doctors
  const [doctors, setDoctors] = useState([]);
  // store doctors filtered by specialty
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  // store services for each doctor (mapped by doctor id)
  const [doctorServices, setDoctorServices] = useState({});
  // store list of unique specialties
  const [specialties, setSpecialties] = useState([]);
  // store selected specialty filter
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  // store error messages
  const [error, setError] = useState('');

  // load doctors and their services on first render
  useEffect(() => {
    loadDoctors();
  }, []);

  // function to fetch doctors and their services
  const loadDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res);
      setFilteredDoctors(res);

      // extract unique specialties
      const uniqueSpecialties = [...new Set(res.map((d) => d.specialty).filter(Boolean))];
      setSpecialties(uniqueSpecialties);

      // build a map of doctor id to their services
      const servicesMap = {};
      for (const doctor of res) {
        const services = await getDoctorServicesById(doctor.doctorid);
        servicesMap[doctor.doctorid] = services;
      }
      setDoctorServices(servicesMap);
    } catch {
      setError('Failed to load doctors or services');
    }};

  // function to filter doctors based on selected specialty
  const handleSpecialtyFilter = (e) => {
    const value = e.target.value;
    setSelectedSpecialty(value);

    if (!value) {
      // show all doctors if no specialty is selected
      setFilteredDoctors(doctors);
    } else {
      // show only doctors with the selected specialty
      setFilteredDoctors(doctors.filter((d) => d.specialty === value));
    }};

  return (
    <div className="page-container">
      <h2 className="page-title">FIND A DOCTOR</h2>

      {/* show error message if something goes wrong */}
      {error && <div className="error-message">{error}</div>}

      {/* dropdown to filter doctors by specialty */}
      <div className="form" style={{ marginBottom: '1.5rem' }}>
        <select
          className="form-select"
          value={selectedSpecialty}
          onChange={handleSpecialtyFilter}
          style={{ padding: '0.6rem', borderRadius: '6px', maxWidth: '300px' }}
        >
          <option value="">— All Specialties —</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* list of filtered doctors with their services */}
      <ul className="item-list">
        {filteredDoctors.map((d) => (
          <li key={d.doctorid} className="item">
            <div>
              <h4>Dr. {d.firstname} {d.lastname}</h4>
              <p><strong>Specialty:</strong> {d.specialty}</p>
              <p><strong>Email:</strong> {d.email || '–'}</p>
              <p><strong>Phone:</strong> {d.phone}</p>

              <div>
                <strong>Services:</strong>
                <ul>
                  {(doctorServices[d.doctorid] || []).map((s) => {
                    const svc = s.ServiceCatalog || s.service || {};
                    return (
                      <li key={s.doctorserviceid}>
                        {svc.name} — {svc.description || 'No description'} — €{svc.price}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
