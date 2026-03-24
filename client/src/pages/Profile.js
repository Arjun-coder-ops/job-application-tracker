import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Save, Upload, FileText, Download, Trash2 } from 'lucide-react';

const Profile = () => {
  const { currentUser, fetchProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    linkedin: currentUser?.linkedin || '',
    github: currentUser?.github || '',
    portfolio: currentUser?.portfolio || '',
    skills: currentUser?.skills || '',
    experience: currentUser?.experience || '',
    education: currentUser?.education || ''
  });
  
  const [resume, setResume] = useState(null);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  const handleResumeSelect = (e) => setResume(e.target.files[0]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (resume) data.append('resume', resume);
      
      await axios.put('/api/auth/profile', data);
      await fetchProfile();
      setMessage('Profile updated successfully!');
      setResume(null); // clear selection
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) return;
    try {
      await axios.put('/api/auth/change-password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage('Password changed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error changing password');
    }
  };

  const deleteResume = async () => {
    if(!currentUser.resume) return;
    if(window.confirm('Delete your master resume?')){
      try {
        await axios.delete(`/api/auth/resume/${currentUser.resume}`);
        await fetchProfile();
      } catch (e) {
        console.error('Delete failed', e);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile Settings</h1>
        <p className="text-on-surface-variant text-sm mt-1">Manage your identity and master resume</p>
      </div>

      {message && (
        <div className="p-4 bg-tertiary-container/20 border border-tertiary/50 rounded-xl text-tertiary text-center font-medium">
          {message}
        </div>
      )}

      {/* Basic Hero Panel */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary-fixed text-4xl font-bold shadow-lg">
          {currentUser?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
          <p className="text-on-surface-variant">{currentUser?.email}</p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={saveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold border-b border-outline-variant/20 pb-2 mb-4">Basic Details</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-on-surface-variant">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleProfileChange} className="w-full bg-surface-container-lowest rounded-lg px-4 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-on-surface-variant">Phone & Location</label>
              <div className="flex gap-2">
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleProfileChange} className="flex-1 bg-surface-container-lowest rounded-lg px-4 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
                <input type="text" name="location" placeholder="City, State" value={formData.location} onChange={handleProfileChange} className="flex-1 bg-surface-container-lowest rounded-lg px-4 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-on-surface-variant">Professional Links</label>
              <input type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleProfileChange} className="w-full mb-2 bg-surface-container-lowest rounded-lg px-4 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
              <input type="text" name="portfolio" placeholder="Portfolio/Website URL" value={formData.portfolio} onChange={handleProfileChange} className="w-full bg-surface-container-lowest rounded-lg px-4 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold border-b border-outline-variant/20 pb-2 mb-4">Master Resume</h3>
            
            {currentUser?.resume ? (
               <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border border-primary/20">
                 <div className="flex items-center gap-3 overflow-hidden">
                   <FileText className="text-primary flex-shrink-0" />
                   <span className="text-sm truncate text-on-surface">{currentUser.resume.substring(currentUser.resume.indexOf('-')+1)}</span>
                 </div>
                 <div className="flex gap-2">
                   <a href={`http://localhost:5000/api/auth/resume/${currentUser.resume}`} target="_blank" rel="noreferrer" className="p-2 text-secondary hover:bg-surface-variant rounded-lg transition-colors">
                     <Download size={18} />
                   </a>
                   <button type="button" onClick={deleteResume} className="p-2 text-error hover:bg-surface-variant rounded-lg transition-colors">
                     <Trash2 size={18} />
                   </button>
                 </div>
               </div>
            ) : (
               <div className="text-sm text-on-surface-variant italic py-2">No master resume uploaded.</div>
            )}

            <div className="mt-4 border-2 border-dashed border-outline-variant/40 rounded-xl p-4 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors cursor-pointer relative">
              <Upload className="text-outline mb-1" size={24} />
              <p className="text-xs font-medium text-on-surface mt-1">Upload New Resume</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept=".pdf,.doc,.docx" onChange={handleResumeSelect} />
            </div>
            {resume && <p className="text-xs text-secondary">Selected: {resume.name}</p>}
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold border-b border-outline-variant/20 pb-2 mb-4">Professional Background</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-on-surface-variant">Top Skills (comma separated)</label>
                <textarea name="skills" value={formData.skills} onChange={handleProfileChange} rows="2" className="w-full bg-surface-container-lowest rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50 resize-none"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-on-surface-variant">Brief Experience Summary</label>
                <textarea name="experience" value={formData.experience} onChange={handleProfileChange} rows="3" className="w-full bg-surface-container-lowest rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50 resize-none"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-on-surface-variant">Education</label>
                <input type="text" name="education" value={formData.education} onChange={handleProfileChange} className="w-full bg-surface-container-lowest rounded-lg px-4 py-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
              </div>
            </div>
        </div>

        <button disabled={loading} type="submit" className="w-full kinetic-gradient py-4 rounded-xl font-bold text-on-primary-fixed shadow-lg hover:scale-[1.01] active:scale-95 transition-all">
          {loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>

      {/* Password Change */}
      <form onSubmit={savePassword} className="glass-panel p-6 rounded-3xl space-y-4 mt-8">
        <h3 className="text-xl font-bold border-b border-outline-variant/20 pb-2 mb-4">Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="password" required name="currentPassword" placeholder="Current Password" value={passwords.currentPassword} onChange={handlePassChange} className="bg-surface-container-lowest rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
          <input type="password" required name="newPassword" placeholder="New Password (min 6 chars)" value={passwords.newPassword} onChange={handlePassChange} className="bg-surface-container-lowest rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-secondary/50" />
        </div>
        <button type="submit" className="px-6 py-3 border border-secondary/50 text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-xl font-bold flex ml-auto">
          Update Password
        </button>
      </form>

    </div>
  );
};

export default Profile;
