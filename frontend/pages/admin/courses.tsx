import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminCourses() {
  return (
    <AdminLayout>
      <CrudManager
        title="Courses & Teaching Subjects"
        apiPath="courses"
        fields={[
          { name: 'code', label: 'Course Code (e.g. CS-602, AI-801)', type: 'text', required: true },
          { name: 'title', label: 'Subject / Course Title', type: 'text', required: true },
          { name: 'research_area_id', label: 'Research Area (Knowledge Graph)', type: 'select', optionsFrom: 'research-areas' },
          { name: 'description', label: 'Course Description & Syllabus Highlights', type: 'textarea' },
          { name: 'semester', label: 'Semester / Term (e.g. Fall 2025, Spring 2026)', type: 'text' },
        ]}
      />
    </AdminLayout>
  );
}
