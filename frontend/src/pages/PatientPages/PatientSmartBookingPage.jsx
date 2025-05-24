import { useEffect, useState } from 'react';
import Select from 'react-select';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getServices } from '../../api/service';
import { getAvailableSlotsForService } from '../../api/doctorservices';
import { createBooking } from '../../api/booking';
import '../../styles/styles.css';

// main component for booking an appointment smartly
export default function PatientSmartBookingPage() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState('');
  const [highlightDates, setHighlightDates] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const res = await getServices();
    setServices(res);
  };

  const handleServiceChange = async (option) => {
    setSelectedService(option);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setMessage('');

    const result = await getAvailableSlotsForService(option.value);
    setSlots(result);
    setFilteredSlots(result);

    if (result.length === 0) {
      setMessage('No available slots for this service.');
    }

    const uniqueDoctors = [
      ...new Map(
        result.map((s) => [
          s.doctor.doctorid,
          {
            value: s.doctor.doctorid,
            label: `Dr. ${s.doctor.firstname} ${s.doctor.lastname} (${s.doctor.specialty})`,
          },
        ])).values(),
    ];
    setDoctorOptions(uniqueDoctors);

    const availableDates = [
      ...new Set(result.map((s) => new Date(s.date).toDateString())),
    ];
    setHighlightDates(availableDates);
  };

  const handleDoctorChange = (option) => {
    setSelectedDoctor(option);
    setSelectedDate(null);

    const filtered = option
      ? slots.filter((s) => s.doctor.doctorid === option.value)
      : slots;

    setFilteredSlots(filtered);
    setHighlightDates([
      ...new Set(filtered.map((s) => new Date(s.date).toDateString())),
    ]);
  };

  const handleDayClick = (date) => {
    const dateStr = date.toDateString();
    if (!highlightDates.includes(dateStr)) return;
    setSelectedDate(date);
    setMessage('');
  };

  const handleBooking = async (slot) => {
    const res = await createBooking({
      servicecatalogid: selectedService.value,
      scheduleid: slot.scheduleid,
    });

    if (res.booking) {
      setMessage('Booking successful!');
    } else {
      setMessage(res.message || 'Booking failed.');
    }
  };

  const now = new Date();
  const slotsForSelectedDate = filteredSlots
    .filter((s) => new Date(s.date).toDateString() === selectedDate?.toDateString())
    .filter((s) => new Date(`${s.date}T${s.starttime}`) > now);

  return (
    <div className="page-container">
      <h2 className="page-title">BOOK AN APPOINTMENT</h2>

      {message && (
        <div
          className={message.includes('successful') ? 'password-hint' : 'error-message'}
        >
          {message}
        </div>
      )}

      <div className="form" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Select
          options={services.map((s) => ({
            value: s.servicecatalogid,
            label: `${s.name} — €${s.price}`,
          }))}
          placeholder="Select a service"
          value={selectedService}
          onChange={handleServiceChange}
          className="select"
        />

        {doctorOptions.length > 0 && (
          <Select
            options={doctorOptions}
            placeholder="Filter by doctor (optional)"
            value={selectedDoctor}
            onChange={handleDoctorChange}
            isClearable
            className="select"
            styles={{ container: (base) => ({ ...base, marginTop: '1rem' }) }}
          />
        )}
      </div>

      {filteredSlots.length > 0 && (
        <>
          <div style={{ marginTop: '2rem' }}>
            <Calendar
              onClickDay={handleDayClick}
              className="smart-booking-calendar"
              tileClassName={({ date }) =>
                highlightDates.includes(date.toDateString()) ? 'highlight' : null
              }
              tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
            />
          </div>

          {selectedDate && (
            <div className="slots-section" style={{ marginTop: '2rem' }}>
              <h4>Available slots on {selectedDate.toDateString()}:</h4>
              {slotsForSelectedDate.length > 0 ? (
                <ul className="item-list">
                  {slotsForSelectedDate.map((slot) => (
                    <li key={slot.scheduleid} className="item">
                      {slot.starttime}–{slot.endtime} — Dr. {slot.doctor.firstname}{' '}
                      {slot.doctor.lastname} ({slot.doctor.specialty})
                      <button
                        onClick={() => handleBooking(slot)}
                        className="btn btn-primary"
                      >
                        Book
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No slots for this date.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
