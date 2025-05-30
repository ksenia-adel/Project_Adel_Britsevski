# BookMyDoc

### A fullstack doctor appointment booking system for managing doctors, patients, schedules, and services.  

Built with React (frontend), Node.js/Express (backend), and PostgreSQL.  

---

## Features

- Role-based Authentication (Admin / Doctor / Patient)
- Appointment booking & schedule management
- Admin management of doctors, patients, and services
- Real-time statistics dashboard
- NoSQL logging of user actions with MongoDB
- Swagger API documentation for all backend endpoints

---

## Roles Overview

| Role    | Permissions                                                                 |
|---------|------------------------------------------------------------------------------|
| Patient | Register, log in, view doctors, book & cancel appointments                  |
| Doctor  | Log in, manage their schedule, view & manage assigned services              |
| Admin   | Full control over users, services, schedules, and system statistics         |

---

## Tech Stack

- **Frontend**: React, Axios, React Router, Bootstrap, CSS
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL (main), MongoDB (for logs)
- **Auth**: JWT (stored in localStorage)
- **Docs**: Swagger UI

---

## Getting Started

### Backend Setup

```bash
cd backend
npm install
```


Create a .env file inside /backend:

```bash
PORT=3001
DB_HOST=dev.vk.edu.ee
DB_PORT=5432
DB_DATABASE=xxx
DB_USER=xxx
DB_PASSWORD=xxx
DB_DIALECT=postgres
DB_SCHEMA=onlinedoc
JWT_SECRET=xxx
MONGO_URI=mongodb://localhost:27017/onlinedoc_logs
```
Start the server:

```bash
node app.js
```

## MongoDB Integration

This project uses **MongoDB** alongside PostgreSQL to store system activity logs in a flexible, scalable NoSQL format.

Each time a patient creates a booking, a log entry is saved in MongoDB, containing:
- Action name (e.g. "Booking created")
- Patient email
- Schedule ID
- Doctor ID
- Timestamp

This makes it easy to analyze actions and keep historical records without overloading the main relational database.

MongoDB is connected using Mongoose and initialized on server startup.

To run MongoDB locally:
1. Install MongoDB Compass[(https://www.mongodb.com/try/download/community)](https://www.mongodb.com/try/download/compass)
2. Add new connection mongodb://localhost:27017
3. Open the onlinedoc_logs database
4. View the logs collection to see real-time actions from the app

   ![image](https://github.com/user-attachments/assets/3c793671-7cd4-47a3-8264-ec50e5019885)


_____________________________________________________________________________________________________________________________
### Swagger documentation: http://localhost:3001/api-docs

## Frontend Setup

Always show details

```bash
cd frontend
npm install
npm start
```

Runs at: http://localhost:3000


#### To log in as Admin:
- Email: admin1@example.com
- Password: admin1

#### To log in as Doctor:
- Email: doctor1@example.com
- Password: doctor1

#### To log in as Patient:
- Email: patient1@example.com
- Password: patient1

OR Register new user

# API Endpoints

## Auth
| Method | URL                  | Description               |
|--------|----------------------|---------------------------|
| POST   | `/api/auth/login`    | User login                |
| POST   | `/api/auth/register` | User registration         |

## Doctors
| Method | URL                          | Description                            |
|--------|------------------------------|----------------------------------------|
| GET    | `/api/doctors`               | Fetch all doctors                   |
| POST   | `/api/doctors`               | Create a doctor (admin only)           |
| GET    | `/api/doctors/bookings`      | Get bookings (doctor only)             |

## Patients
| Method | URL                   | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/patients`       | Retrieve all patients (admin only) |
| PUT    | `/api/patients/:id`   | Update patient by ID               |
| DELETE | `/api/patients/:id`   | Delete patient by ID               |

## Services
| Method | URL                  | Description                                |
|--------|----------------------|--------------------------------------------|
| GET    | `/api/services`      | Retrieve all services                      |
| POST   | `/api/services`      | Create a service (admin only)              |
| PUT    | `/api/services/:id`  | Update service by ID (admin only)          |
| DELETE | `/api/services/:id`  | Delete service by ID (admin only)          |

## Bookings
| Method | URL                        | Description                              |
|--------|----------------------------|------------------------------------------|
| POST   | `/api/bookings`            | Create a booking (patient only)          |
| GET    | `/api/bookings`            | Get own bookings (patient)               |
| DELETE | `/api/bookings/:id`        | Cancel a booking                         |
| PUT    | `/api/bookings/:id/pay`    | Mark booking as paid                     |
| GET    | `/api/bookings/doctor`     | Get doctor's bookings                    |

## Doctor Services
| Method | URL                                           | Description                                  |
|--------|-----------------------------------------------|----------------------------------------------|
| POST   | `/api/doctorservices`                         | Link doctor to service (doctor/admin)        |
| GET    | `/api/doctorservices/my`                      | Get own services (doctor)                    |
| GET    | `/api/doctorservices/:doctorid`               | Get services by doctor ID                    |
| DELETE | `/api/doctorservices/:id`                     | Delete doctor-service link                   |
| GET    | `/api/doctorservices/available/:servicecatalogid` | Get available slots for service         |

## Schedule
| Method | URL                              | Description                               |
|--------|----------------------------------|-------------------------------------------|
| POST   | `/api/schedules`                 | Create a schedule slot (doctor only)      |
| GET    | `/api/schedules`                 | Get own schedule (doctor only)            |
| DELETE | `/api/schedules/:id`             | Delete a schedule slot                    |
| GET    | `/api/schedules/available-dates` | Get available dates                       |
| GET    | `/api/schedules/doctors/:doctorid` | Get doctor's schedule by ID             |

## Statistics
| Method | URL              | Description                        |
|--------|------------------|------------------------------------|
| GET    | `/api/statistics`| Retrieve system statistics (admin) |
| POST   | `/api/statistics`| Save current statistics (admin)    |

## Admins
| Method | URL                | Description                        |
|--------|--------------------|------------------------------------|
| POST   | `/api/admins`      | Create an admin (admin only)       |
| GET    | `/api/admins`      | Retrieve all admins                |
| PUT    | `/api/admins/:id`  | Update admin by ID                 |
| DELETE | `/api/admins/:id`  | Delete admin by ID                 |

## Screenshots

### Pages for Admins

#### Login Page


<img src="https://github.com/user-attachments/assets/0a376974-303f-4b61-83f4-0b44217c25dd" width="600"/>

#### Register Page
<img src="https://github.com/user-attachments/assets/cbb484b6-d33a-4278-946d-fa0b67159bce" width="600"/>

#### Admins Management
<img src="https://github.com/user-attachments/assets/e8054816-c3ec-47f8-a889-dd713acc90fb" width="600"/>

#### Doctors Management
<img src="https://github.com/user-attachments/assets/372eb7a5-df90-4332-9a76-6977ee2ea49c" width="600"/>

#### Services Management
<img src="https://github.com/user-attachments/assets/510b10df-32c8-4dc7-942a-02e46d006def" width="600"/>

#### Patients Management
<img src="https://github.com/user-attachments/assets/d7dcf54e-7d81-4102-b6d8-41932de6c5c5" width="600"/>

#### System Statistics
<img src="https://github.com/user-attachments/assets/f3ec17de-debd-493f-8634-bd7835e885cd" width="600"/>

### Doctor Pages

#### Doctor Schedule 
<img src="https://github.com/user-attachments/assets/1f8c6b0a-43c6-4141-b58a-a985cc1c2b64" width="600"/>

#### Doctor Services
<img src="https://github.com/user-attachments/assets/302fb304-f2a2-496a-8516-7dfdef48e84a" width="600"/>

#### Doctor Bookings
<img src="https://github.com/user-attachments/assets/0618b01d-94d1-4368-9dec-492bb4273f7a" width="600"/>

### Patient Pages

#### My Bookings
<img src="https://github.com/user-attachments/assets/cba10c79-a2bf-405f-b955-f4c820279622" width="600"/>

#### Find Doctor by Speciality
<img src="https://github.com/user-attachments/assets/63dee3ec-83eb-45dc-8fab-13a3db0be4b7" width="600"/>


#### Make New Booking
<img src="https://github.com/user-attachments/assets/7f29a49f-c2ae-4d1c-bf64-2dbe06027017" width="600"/>


### Future project development ideas

Patient reviews and star ratings after visits

Booking History & Documents

Patients can view their appointment history

Appointment Reminders

Email/SMS reminders before the visit


## Author

Created by **Ksenia Adel / Mark Britševski**  
GitHub: [https://github.com/ksenia-adel](https://github.com/ksenia-adel)
