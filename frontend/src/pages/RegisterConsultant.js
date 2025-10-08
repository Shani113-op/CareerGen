import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const CLOUDINARY_UPLOAD_PRESET = 'unsigned_receipts';
const CLOUDINARY_CLOUD_NAME = 'dvxsgxp3f';

const RegisterConsultant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    role: '',
    expertise: '',
    experience: '',
    bio: '',
    email: '',
    password: '',
    image: '',
    availability: ['']
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e, idx = null) => {
    const { name, value } = e.target;
    if (name === 'availability' && idx !== null) {
      const updated = [...form.availability];
      updated[idx] = value;
      setForm({ ...form, availability: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addTime = () => {
    setForm(prev => ({
      ...prev,
      availability: [...prev.availability, '']
    }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return alert('⚠️ Please select an image first.');
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error('Image upload failed');

      setForm(prev => ({ ...prev, image: data.secure_url }));
      alert('✅ Image uploaded successfully');
    } catch (err) {
      console.error('Image upload error:', err.message);
      alert('❌ Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/register-consultant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Consultant registered');
        navigate('/admin-dashboard');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="register-modal">
        <header className="modal-header">
          <h2>Register Consultant</h2>
          <span className="clos-btn" onClick={() => navigate('/admin-dashboard')}>×</span>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="form-section-label">Basic Info</p>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="role" value={form.role} onChange={handleChange} placeholder="Role (e.g. Career Coach)" required />
          <input name="expertise" value={form.expertise} onChange={handleChange} placeholder="Expertise (e.g. Engineering, Medicine)" required />
          <input name="experience" value={form.experience} onChange={handleChange} placeholder="Years of Experience" required />
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />

          <p className="form-section-label">Upload Image</p>
          <div className="upload-section">
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            <button type="button" onClick={handleImageUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {form.image && (
              <img src={form.image} alt="Preview" className="image-preview" />
            )}
          </div>

          <p className="form-section-label">Availability</p>
          {form.availability.map((time, idx) => (
            <input
              key={idx}
              name="availability"
              value={time}
              onChange={(e) => handleChange(e, idx)}
              placeholder="e.g. 10:00 AM - 12:00 PM"
              required
            />
          ))}
          <button type="button" className="add-slot" onClick={addTime}>➕ Add Time</button>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterConsultant;
