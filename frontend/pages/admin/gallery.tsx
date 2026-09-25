import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminGallery() {
  return (
    <AdminLayout>
      <CrudManager
        title="Gallery"
        apiPath="gallery"
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'image_url', label: 'Image URL', type: 'url' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
      />
    </AdminLayout>
  );
}
