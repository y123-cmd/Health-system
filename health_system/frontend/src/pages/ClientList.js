import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients } from '../services/api';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await getClients(searchTerm);
        const data = response.data;
        
        if (data.results) {
          // Pagination data from API
          setClients(data.results);
          setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
        } else {
          // API returned array directly
          setClients(data);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchTerm, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="clients-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Clients</h1>
        <Link to="/clients/new" className="btn btn-primary">
          Register New Client
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Search clients by name, email, or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">Search</button>
            </div>
          </form>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="alert alert-info">No clients found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Programs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td>
                      <Link to={`/clients/${client.id}`} className="text-decoration-none">
                        {client.first_name} {client.last_name}
                      </Link>
                    </td>
                    <td>
                      {client.gender === 'M' ? 'Male' : 
                       client.gender === 'F' ? 'Female' : 'Other'}
                    </td>
                    <td>{client.contact_number}</td>
                    <td>{client.email || '-'}</td>
                    <td>
                      <span className="badge bg-primary rounded-pill">
                        {client.programs?.length || 0}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link to={`/clients/${client.id}`} className="btn btn-outline-primary">
                          View
                        </Link>
                        <Link to={`/clients/edit/${client.id}`} className="btn btn-outline-secondary">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav aria-label="Clients pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map(page => (
                  <li 
                    key={page} 
                    className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ClientList;