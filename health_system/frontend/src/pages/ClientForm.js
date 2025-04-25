import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getClient, createClient, updateClient } from '../services/api';

const ClientSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  last_name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  date_of_birth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Required'),
  gender: Yup.string()
    .oneOf(['M', 'F', 'O'], 'Invalid gender')
    .required('Required'),
  contact_number: Yup.string()
    .required('Required'),
  email: Yup.string()
    .email('Invalid email'),
  address: Yup.string()
    .required('Required'),
  medical_history: Yup.string()
});

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    email: '',
    address: '',
    medical_history: ''
  });

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          setLoading(true);
          const response = await getClient(id);
          const client = response.data;
          
          // Format date to YYYY-MM-DD for input[type="date"]
          const formattedDate = client.date_of_birth ? 
            new Date(client.date_of_birth).toISOString().split('T')[0] : '';
            
          setInitialValues({
            ...client,
            date_of_birth: formattedDate
          });
        } catch (err) {
          console.error('Error fetching client:', err);
          setError('Failed to load client data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchClient();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (id) {
        await updateClient(id, values);
        navigate(`/clients/${id}`, { state: { message: 'Client updated successfully' } });
      } else {
        const response = await createClient(values);
        navigate(`/clients/${response.data.id}`, { state: { message: 'Client created successfully' } });
      }
    } catch (err) {
      console.error('Error saving client:', err);
      setError('Failed to save client. Please try again later.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="client-form">
      <h1 className="mb-4">{id ? 'Edit Client' : 'Register New Client'}</h1>
      
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={ClientSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="first_name" className="form-label">First Name *</label>
                    <Field 
                      name="first_name" 
                      type="text" 
                      className={`form-control ${touched.first_name && errors.first_name ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage 
                      name="first_name" 
                      component="div" 
                      className="invalid-feedback" 
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name *</label>
                    <Field 
                      name="last_name" 
                      type="text" 
                      className={`form-control ${touched.last_name && errors.last_name ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage 
                      name="last_name" 
                      component="div" 
                      className="invalid-feedback" 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="date_of_birth" className="form-label">Date of Birth *</label>
                    <Field 
                      name="date_of_birth" 
                      type="date" 
                      className={`form-control ${touched.date_of_birth && errors.date_of_birth ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage 
                      name="date_of_birth" 
                      component="div" 
                      className="invalid-feedback" 
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gender" className="form-label">Gender *</label>
                    <Field 
                      as="select" 
                      name="gender" 
                      className={`form-select ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </Field>
                    <ErrorMessage 
                      name="gender" 
                      component="div" 
                      className="invalid-feedback" 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="contact_number" className="form-label">Contact Number *</label>
                    <Field 
                      name="contact_number" 
                      type="text" 
                      className={`form-control ${touched.contact_number && errors.contact_number ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage 
                      name="contact_number" 
                      component="div" 
                      className="invalid-feedback" 
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field 
                      name="email" 
                      type="email" 
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage 
                      name="email" 
                      component="div" 
                      className="invalid-feedback" 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address *</label>
                  <Field 
                    name="address" 
                    as="textarea" 
                    rows="2"
                    className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage 
                    name="address" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="medical_history" className="form-label">Medical History</label>
                  <Field 
                    name="medical_history" 
                    as="textarea" 
                    rows="3"
                    className={`form-control ${touched.medical_history && errors.medical_history ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage 
                    name="medical_history" 
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
                        Saving...
                      </>
                    ) : id ? 'Update Client' : 'Register Client'}
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

export default ClientForm;