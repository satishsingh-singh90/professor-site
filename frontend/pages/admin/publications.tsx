import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminPublications() {
  return (
    <AdminLayout>
      <CrudManager
        title="Publications"
        apiPath="publications"
        fields={[
          { name: 'title', label: 'Paper Title', type: 'text', required: true },
          { name: 'research_area_id', label: 'Research Area (Knowledge Graph)', type: 'select', optionsFrom: 'research-areas' },
          { name: 'authors', label: 'Authors (e.g. Dr. Prabh Deep Singh, et al.)', type: 'text' },
          { name: 'year', label: 'Year', type: 'number' },
          { name: 'journal', label: 'Journal / Conference Name', type: 'text' },
          { name: 'abstract', label: 'Abstract / Key Findings', type: 'textarea' },
          { name: 'doi', label: 'DOI (e.g. 10.1109/...)', type: 'text' },
          { name: 'link', label: 'Publication / PDF Link', type: 'url' },
        ]}
      />
    </AdminLayout>
  );
}
