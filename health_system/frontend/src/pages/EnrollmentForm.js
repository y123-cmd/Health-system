import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getClients, getPrograms, enrollClient } from '../services/api';

const EnrollmentSchema = Yup.object().shape({
  client_id: Yup.number().required('Client is required'),
  program_id: Yup.number().required('Program is required'),
  enrollment_date: Yup.date().required('Enrollment date is required'),
  notes: Yup.string()
});

const EnrollmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get clientId from location state if available (from client detail page)
  const preselectedClientId = location.state?.clientId;
  
  const initialValues = {
    client_id: preselectedClientId || '',
    program_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsResponse, programsResponse] = await Promise.all([
          getClients(),
          getPrograms()
        ]);
        
        setClients(clientsResponse.data.results || clientsResponse.data);
        setPrograms(programsResponse.data.results || programsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load necessary data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await enrollClient(values.client_id, values.program_id, {
        enrollment_date: values.enrollment_date,
        notes: values.notes
      });
      
      // Navigate back to client detail page
      navigate(`/clients/${values.client_id}`, { 
        state: { message: 'Client enrolled successfully' } 
      });
    } catch (err) {
      console.error('Error enrolling client:', err);
      setError(err.response?.data?.error || 'Failed to enroll client. Please try again later.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="enrollment-form">
      <h1 className="mb-4">Enroll Client in Program</h1>
      
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={EnrollmentSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="client_id" className="form-label">Client *</label>
                  <Field 
                    as="select"
                    name="client_id" 
                    className={`form-select ${touched.client_id && errors.client_id ? 'is-invalid' : ''}`}
                    disabled={preselectedClientId}
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage 
                    name="client_id" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="program_id" className="form-label">Program *</label>
                  <Field 
                    as="select"
                    name="program_id" 
                    className={`form-select ${touched.program_id && errors.program_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Program</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage 
                    name="program_id" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="enrollment_date" className="form-label">Enrollment Date *</label>
                  <Field 
                    name="enrollment_date" 
                    type="date" 
                    className={`form-control ${touched.enrollment_date && errors.enrollment_date ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage 
                    name="enrollment_date" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <Field 
                    name="notes" 
                    as="textarea" 
                    rows="3"
                    className={`form-control ${touched.notes && errors.notes ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage 
                    name="notes" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enrolling...
                      </>
                    ) : 'Enroll Client'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;