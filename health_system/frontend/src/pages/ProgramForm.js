import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getProgram, createProgram, updateProgram } from '../services/api';

const ProgramSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .required('Required')
});

const ProgramForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      const fetchProgram = async () => {
        try {
          setLoading(true);
          const response = await getProgram(id);
          setInitialValues(response.data);
        } catch (err) {
          console.error('Error fetching program:', err);
          setError('Failed to load program data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchProgram();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (id) {
        await updateProgram(id, values);
        navigate('/programs', { state: { message: 'Program updated successfully' } });
      } else {
        await createProgram(values);
        navigate('/programs', { state: { message: 'Program created successfully' } });
      }
    } catch (err) {
      console.error('Error saving program:', err);
      setError('Failed to save program. Please try again later.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="program-form">
      <h1 className="mb-4">{id ? 'Edit Health Program' : 'Create Health Program'}</h1>
      
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={ProgramSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Program Name *</label>
                  <Field 
                    name="name" 
                    type="text" 
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <Field 
                    name="description" 
                    as="textarea" 
                    rows="5"
                    className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage 
                    name="description" 
                    component="div" 
                    className="invalid-feedback" 
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/programs')}
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
                    ) : id ? 'Update Program' : 'Create Program'}
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

export default ProgramForm;