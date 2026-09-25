import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminPatents() {
  return (
    <AdminLayout>
      <CrudManager
        title="Patents"
        apiPath="patents"
        fields={[
          { name: 'title', label: 'Patent Title / Invention', type: 'text', required: true },
          { name: 'research_area_id', label: 'Research Area (Knowledge Graph)', type: 'select', optionsFrom: 'research-areas' },
          { name: 'inventors', label: 'Inventors', type: 'text' },
          { name: 'year', label: 'Year Filed / Granted', type: 'number' },
          { name: 'patent_number', label: 'Patent Number / Application ID', type: 'text' },
          { name: 'description', label: 'Patent Description / Claims Summary', type: 'textarea' },
          { name: 'link', label: 'Official Patent Gazette / Filing Link', type: 'url' },
        ]}
      />
    </AdminLayout>
  );
}
