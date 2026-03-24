import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Briefcase, CalendarClock, Award, XCircle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, statusBreakdown: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        axios.get('/api/jobs'),
        axios.get('/api/jobs/stats/overview'),
      ]);
      setJobs(jobsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (statusName) => {
    const item = stats.statusBreakdown.find(s => s._id === statusName);
    return item ? item.count : 0;
  };

  const statusStyles = {
    'Applied': 'bg-surface-variant text-on-surface-variant',
    'Interview': 'bg-secondary-container text-on-secondary-container',
    'Offer': 'bg-tertiary-container text-on-tertiary-container',
    'Rejected': 'bg-error-container text-on-error-container',
  };

  if (loading) return <div className="text-center pt-20">Loading...</div>;

  return (
    <>
      {/* Welcome & Action Row */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-on-surface-variant font-medium tracking-wider text-sm uppercase">Command Center</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome back, {currentUser?.name?.split(' ')[0]}</h1>
        </div>
        <button onClick={() => navigate('/job/new')} className="kinetic-gradient text-on-primary-fixed font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-primary/20">
          <Plus size={20} />
          Add New Job
        </button>
      </section>

      {/* Stats Summary */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Total Jobs */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-xl kinetic-gradient flex items-center justify-center text-on-primary-fixed">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter">
              {String(stats.total).padStart(2, '0')}
            </p>
            <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mt-1">Total Jobs</p>
          </div>
        </div>

        {/* Interviews */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center neon-glow-cyan text-on-secondary-fixed">
            <CalendarClock size={24} />
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-secondary">
              {String(getStatusCount('Interview')).padStart(2, '0')}
            </p>
            <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mt-1">Interviews</p>
          </div>
        </div>

        {/* Offers */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-4 border-t border-primary/20 bg-primary/5">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary-fixed">
            <Award size={24} />
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-primary">
              {String(getStatusCount('Offer')).padStart(2, '0')}
            </p>
            <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mt-1">Offers</p>
          </div>
        </div>

        {/* Rejected */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-error">
              {String(getStatusCount('Rejected')).padStart(2, '0')}
            </p>
            <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mt-1">Rejected</p>
          </div>
        </div>
      </section>

      {/* Recent Applications Grid */}
      <section className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Applications</h2>
          <button className="text-secondary font-bold text-sm hover:underline">View All</button>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl">
            <h3 className="text-xl text-on-surface-variant">No applications yet. Start tracking your career moves!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div onClick={() => navigate(`/job/${job._id}`)} key={job._id} className="glass-panel p-6 rounded-3xl hover:bg-surface-container-highest transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary font-bold text-xl uppercase">
                    {job.companyName.charAt(0)}
                  </div>
                  <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${statusStyles[job.currentStatus] || statusStyles['Applied']}`}>
                    {job.currentStatus}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold group-hover:text-secondary transition-colors line-clamp-1">{job.jobRole}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-1">{job.companyName} • {job.location || 'Location TBA'}</p>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs text-outline font-medium">Applied {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <ArrowRight className="text-outline group-hover:text-on-surface" size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
