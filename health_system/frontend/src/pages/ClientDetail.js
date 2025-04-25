import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getClient, getClientEnrollments, deleteClient } from '../services/api';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientResponse = await getClient(id);
        setClient(clientResponse.data);
        
        // Fetch enrollments if not included in client data
        if (!clientResponse.data.enrollments) {
          const enrollmentsResponse = await getClientEnrollments(id);
          setEnrollments(enrollmentsResponse.data);
        } else {
          setEnrollments(clientResponse.data.enrollments);
        }
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      navigate('/clients', { state: { message: 'Client deleted successfully' } });
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Failed to delete client. Please try again later.');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!client) return <div className="alert alert-warning">Client not found</div>;

  return (
    <div className="client-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>{client.first_name} {client.last_name}</h1>
          <p className="text-muted">Client ID: {client.id}</p>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/clients/edit/${client.id}`} className="btn btn-primary">
            Edit Client
          </Link>
          <button 
            className="btn btn-outline-danger"
            onClick={() => setShowConfirmDelete(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="alert alert-danger mb-4">
          <p className="fw-bold">Are you sure you want to delete this client?</p>
          <p>This action cannot be undone.</p>
          <div className="d-flex gap-2">
            <button className="btn btn-danger" onClick={handleDelete}>
              Yes, Delete
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Personal Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label fw-bold">Full Name</label>
                <div className="col-sm-8">
                  <p className="form-control-plaintext">
                    {client.first_name} {client.last_name}
                  </p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label fw-bold">Date of Birth</label>
                <div className="col-sm-8">
                  <p className="form-control-plaintext">
                    {new Date(client.date_of_birth).toLocaleDateString()}
                    {client.age && ` (${client.age} years)`}
                  </p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label fw-bold">Gender</label>
                <div className="col-sm-8">
                  <p className="form-control-plaintext">
                    {client.gender === 'M' ? 'Male' : 
                     client.gender === 'F' ? 'Female' : 'Other'}
                  </p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label fw-bold">Contact Number</label>
                <div className="col-sm-8">
                  <p className="form-control-plaintext">{client.contact_number}</p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label fw-bold">Email</label>
                <div className="col-sm-8">
                  <p className="form-control-plaintext">{client.email || '-'}</p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label fw-bold">Address</label>
                <div className="col-sm-8">
                  <p className="form-control-plaintext">{client.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Medical Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Medical History</label>
                <p className="form-control-plaintext">
                  {client.medical_history || 'No medical history recorded'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Enrolled Programs</h5>
              <Link 
                to="/enrollments/new" 
                state={{ clientId: client.id }}
                className="btn btn-sm btn-primary"
              >
                Enroll in Program
              </Link>
            </div>
            <div className="card-body">
              {enrollments.length === 0 ? (
                <p className="text-muted">Client is not enrolled in any programs.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th>Program</th>
                        <th>Enrollment Date</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map(enrollment => (
                        <tr key={enrollment.id}>
                          <td>{enrollment.program_name}</td>
                          <td>{new Date(enrollment.enrollment_date).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              enrollment.status === 'Active' ? 'bg-success' : 
                              enrollment.status === 'Completed' ? 'bg-info' : 
                              enrollment.status === 'Inactive' ? 'bg-warning' : 
                              'bg-secondary'
                            }`}
                            >
                              {enrollment.status}
                            </span>
                          </td>
                          <td>{enrollment.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;