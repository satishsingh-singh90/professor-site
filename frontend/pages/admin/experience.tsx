import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminExperience() {
  return (
    <AdminLayout>
      <CrudManager
        title="Experience"
        apiPath="experiences"
        fields={[
          { name: 'position', label: 'Position', type: 'text' },
          { name: 'institution', label: 'Institution', type: 'text' },
          { name: 'start_year', label: 'Start Year', type: 'number' },
          { name: 'end_year', label: 'End Year', type: 'number' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
      />
    </AdminLayout>
  );
}
