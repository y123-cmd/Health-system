import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms, deleteProgram } from '../services/api';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [programToDelete, setProgramToDelete] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await getPrograms();
        const data = response.data.results || response.data;
        setPrograms(data);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
  };

  const confirmDelete = async () => {
    if (!programToDelete) return;
    
    try {
      await deleteProgram(programToDelete.id);
      setPrograms(programs.filter(p => p.id !== programToDelete.id));
      setProgramToDelete(null);
    } catch (err) {
      console.error('Error deleting program:', err);
      setError('Failed to delete program. Please try again later.');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="programs-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Health Programs</h1>
        <Link to="/programs/new" className="btn btn-primary">
          Create New Program
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {programToDelete && (
        <div className="alert alert-danger mb-4">
          <p className="fw-bold">
            Are you sure you want to delete the program "{programToDelete.name}"?
          </p>
          <p>This action cannot be undone.</p>
          <div className="d-flex gap-2">
            <button className="btn btn-danger" onClick={confirmDelete}>
              Yes, Delete
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setProgramToDelete(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {filteredPrograms.length === 0 ? (
        <div className="alert alert-info">No programs found.</div>
      ) : (
        <div className="row">
          {filteredPrograms.map(program => (
            <div key={program.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{program.name}</h5>
                  <p className="card-text text-muted small">
                    Created: {new Date(program.created_at).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    {program.description.length > 100 
                      ? `${program.description.substring(0, 100)}...` 
                      : program.description}
                  </p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-end gap-2">
                  <Link 
                    to={`/programs/edit/${program.id}`} 
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </Link>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClick(program)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramList;