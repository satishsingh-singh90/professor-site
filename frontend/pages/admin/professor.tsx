import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

export default function AdminProfessor() {
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/professor/1`)
      .then(res => { reset(res.data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const onSubmit = async (data: any) => {
    await axios.put(`${API_BASE_URL}/admin/professor/1`, data);
    alert('Profile updated!');
  };

  if (isLoading) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading text-navy mb-6">Professor Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input {...register('name')} placeholder="Name" className="border p-2 rounded" />
        <input {...register('title')} placeholder="Title" className="border p-2 rounded" />
        <input {...register('department')} placeholder="Department" className="border p-2 rounded" />
        <input {...register('university')} placeholder="University" className="border p-2 rounded" />
        <textarea {...register('bio')} placeholder="Bio" className="border p-2 rounded md:col-span-2" rows={4} />
        <input {...register('email')} placeholder="Email" className="border p-2 rounded" />
        <input {...register('phone')} placeholder="Phone" className="border p-2 rounded" />
        <input {...register('photo_url')} placeholder="Photo URL" className="border p-2 rounded" />
        <div className="md:col-span-2">
          <button type="submit" className="bg-navy text-white px-6 py-2 rounded-lg">Save Profile</button>
        </div>
      </form>
    </AdminLayout>
  );
}
