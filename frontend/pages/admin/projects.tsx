import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminProjects() {
  return (
    <AdminLayout>
      <CrudManager
        title="Projects"
        apiPath="projects"
        fields={[
          { name: 'title', label: 'Project Title', type: 'text', required: true },
          { name: 'research_area_id', label: 'Research Area (Knowledge Graph)', type: 'select', optionsFrom: 'research-areas' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'year', label: 'Year', type: 'number' },
          { name: 'status', label: 'Status (e.g. Active, Completed, Ongoing)', type: 'text' },
          { name: 'image_url', label: 'Project Image URL', type: 'url' },
          { name: 'link', label: 'Project Link / Repository', type: 'url' },
        ]}
      />
    </AdminLayout>
  );
}
