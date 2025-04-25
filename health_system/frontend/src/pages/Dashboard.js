import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients, getPrograms } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    recentClients: [],
    recentPrograms: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [clientsResponse, programsResponse] = await Promise.all([
          getClients(),
          getPrograms()
        ]);

        const clients = clientsResponse.data.results || clientsResponse.data;
        const programs = programsResponse.data.results || programsResponse.data;

        setStats({
          totalClients: clients.length,
          totalPrograms: programs.length,
          recentClients: clients.slice(0, 5),
          recentPrograms: programs.slice(0, 5)
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard">
      <h1 className="mb-4">Health System Dashboard</h1>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Clients</h5>
              <h1 className="display-4">{stats.totalClients}</h1>
              <Link to="/clients" className="btn btn-light mt-2">View All Clients</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Health Programs</h5>
              <h1 className="display-4">{stats.totalPrograms}</h1>
              <Link to="/programs" className="btn btn-light mt-2">View All Programs</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Clients</h5>
              <Link to="/clients/new" className="btn btn-sm btn-primary">Register New</Link>
            </div>
            <div className="card-body">
              {stats.recentClients.length === 0 ? (
                <p className="text-muted">No clients registered yet.</p>
              ) : (
                <ul className="list-group">
                  {stats.recentClients.map(client => (
                    <li key={client.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <Link to={`/clients/${client.id}`} className="text-decoration-none">
                        {client.first_name} {client.last_name}
                      </Link>
                      <span className="badge bg-primary rounded-pill">
                        {client.programs?.length || 0} Programs
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Health Programs</h5>
              <Link to="/programs/new" className="btn btn-sm btn-success">Create New</Link>
            </div>
            <div className="card-body">
              {stats.recentPrograms.length === 0 ? (
                <p className="text-muted">No programs created yet.</p>
              ) : (
                <ul className="list-group">
                  {stats.recentPrograms.map(program => (
                    <li key={program.id} className="list-group-item">
                      <h6>{program.name}</h6>
                      <p className="text-muted small mb-0">{program.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;