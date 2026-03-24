import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Upload, ChevronLeft, Save, Trash2 } from 'lucide-react';

const AddEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    currentStatus: 'Applied',
    jobDescription: '',
    salary: '',
    location: '',
    jobUrl: ''
  });
  const [file, setFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await axios.get(`/api/jobs/${id}`);
          const job = res.data;
          setFormData({
            companyName: job.companyName || '',
            jobRole: job.jobRole || '',
            currentStatus: job.currentStatus || 'Applied',
            jobDescription: job.jobDescription || '',
            salary: job.salary || '',
            location: job.location || '',
            jobUrl: job.jobUrl || ''
          });
          if (job.resumeFile) {
            setExistingResume(job.resumeFile.originalName || job.resumeFile.filename);
          }
        } catch (error) {
          console.error("Failed to fetch job", error);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('resume', file);

    try {
      if (isEdit) {
        await axios.put(`/api/jobs/${id}`, data);
      } else {
        await axios.post('/api/jobs', data);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to save job", error);
      alert("Error saving job");
    }
  };

  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to delete this job application?")){
      try {
        await axios.delete(`/api/jobs/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  if (loading) return <div className="text-center pt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{isEdit ? 'Edit Application' : 'New Application'}</h1>
          <p className="text-on-surface-variant text-sm mt-1">Track your next big career move</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Company Name *</label>
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Job Role *</label>
              <input type="text" name="jobRole" required value={formData.jobRole} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Status</label>
              <select name="currentStatus" value={formData.currentStatus} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface outline-none transition-all appearance-none cursor-pointer">
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Expected Salary / Range</label>
              <input type="text" name="salary" placeholder="$120k - $150k" value={formData.salary} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Job Posting URL</label>
              <input type="url" name="jobUrl" placeholder="https://" value={formData.jobUrl} onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Job Description Notes</label>
            <textarea name="jobDescription" rows="4" value={formData.jobDescription} onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all resize-none"></textarea>
          </div>

          {/* Resume Upload section */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/20">
            <label className="text-sm font-medium text-on-surface-variant">Specific Resume Applied With</label>
            {existingResume && <p className="text-xs text-secondary mb-2">Current file: {existingResume}</p>}
            <div className="w-full border-2 border-dashed border-outline-variant/40 rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors cursor-pointer relative">
              <Upload className="text-outline mb-2" size={32} />
              <p className="text-sm font-medium text-on-surface text-center">Click to upload or drag and drop</p>
              <p className="text-xs text-outline text-center mt-1">PDF, DOC, DOCX up to 5MB</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </div>
            {file && <p className="text-sm text-secondary mt-2">Selected: {file.name}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 kinetic-gradient text-on-primary-fixed font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
            <Save size={20} />
            {isEdit ? 'Update Application' : 'Save Application'}
          </button>
          
          {isEdit && (
            <button onClick={handleDelete} type="button" className="px-6 bg-error-container/20 border border-error/50 text-error font-bold rounded-xl hover:bg-error-container/40 active:scale-95 transition-all flex items-center justify-center">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditJob;
