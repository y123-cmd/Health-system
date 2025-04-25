# Health Information System

A full-stack web application for managing clients and health programs. This system allows healthcare providers to register clients, create and manage health programs, and enroll clients in programs.

## Features

- Create and manage health programs
- Register and update client information
- Enroll clients in one or more health programs
- Search for clients
- View detailed client profiles
- RESTful API for integrating with other systems

## Tech Stack

### Backend
- Django (Python web framework)
- Django REST Framework (API)
- SQLite database (configurable to other databases)
- JWT Authentication

### Frontend
- React.js
- React Router for navigation
- Formik and Yup for form validation
- Bootstrap for styling
- Axios for API requests

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Clone the repository:
```
git clone <repository-url>
cd health_system/backend
```

2. Create and activate a virtual environment:
```
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run migrations:
```
python manage.py migrate
```

5. Create a superuser:
```
python manage.py createsuperuser
```

6. Start the development server:
```
python manage.py runserver
```

The backend API will be available at http://localhost:8000/api/

### Frontend Setup

1. Navigate to the frontend directory:
```
cd ../frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The frontend application will be available at http://localhost:3000

## API Documentation

API documentation is available at http://localhost:8000/docs/ when the backend server is running.

## Usage

1. Login with the superuser credentials
2. Create health programs via the "Health Programs" section
3. Register clients through the "Clients" section
4. View client details and enroll them in programs

## Data Security Considerations

- JWT token authentication
- Password hashing
- CORS configuration
- Input validation on both frontend and backend
- Protection against SQL injection through Django's ORM

## Future Enhancements

- User roles and permissions
- Advanced reporting features
- Medical record attachments
- Appointment scheduling
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.