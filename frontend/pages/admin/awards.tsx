import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminAwards() {
  return (
    <AdminLayout>
      <CrudManager
        title="Awards & Honors"
        apiPath="awards"
        fields={[
          { name: 'name', label: 'Award / Honor Name', type: 'text', required: true },
          { name: 'research_area_id', label: 'Research Area (Knowledge Graph)', type: 'select', optionsFrom: 'research-areas' },
          { name: 'year', label: 'Year Awarded', type: 'number' },
          { name: 'description', label: 'Awarding Body & Citation Description', type: 'textarea' },
        ]}
      />
    </AdminLayout>
  );
}
