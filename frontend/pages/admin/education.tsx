import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminEducation() {
  return (
    <AdminLayout>
      <CrudManager
        title="Education"
        apiPath="education"
        fields={[
          { name: 'degree', label: 'Degree', type: 'text' },
          { name: 'institution', label: 'Institution', type: 'text' },
          { name: 'year', label: 'Year', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
      />
    </AdminLayout>
  );
}
