import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminSocialLinks() {
  return (
    <AdminLayout>
      <CrudManager
        title="Social Links"
        apiPath="social-links"
        fields={[
          { name: 'platform', label: 'Platform', type: 'text' },
          { name: 'url', label: 'URL', type: 'url' },
          { name: 'icon', label: 'Icon class', type: 'text' },
        ]}
      />
    </AdminLayout>
  );
}
