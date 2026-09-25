import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminTestimonials() {
  return (
    <AdminLayout>
      <CrudManager
        title="Testimonials"
        apiPath="testimonials"
        fields={[
          { name: 'student_name', label: 'Student Name', type: 'text', required: true },
          { name: 'course', label: 'Degree / Academic Role (e.g. Ph.D. Scholar, M.Tech Researcher)', type: 'text' },
          { name: 'institution', label: 'Current Affiliation / Placement (e.g. Postdoc at Max Planck, Lead AI Engineer)', type: 'text' },
          { name: 'year', label: 'Graduation / Cohort Year (e.g. 2024)', type: 'number' },
          { name: 'avatar_url', label: 'Photo URL (Fixed-size student portrait image)', type: 'text' },
          { name: 'highlight', label: 'Short Punchy Quote Highlight', type: 'text' },
          { name: 'content', label: 'Full Written Testimonial Content', type: 'textarea', required: true },
          { name: 'youtube_url', label: 'YouTube Video Testimonial Link (e.g. https://www.youtube.com/watch?v=...)', type: 'text' },
          { name: 'video_duration', label: 'Video Duration (e.g. 3:15)', type: 'text' },
          { name: 'rating', label: 'Rating (1 to 5 stars)', type: 'number' },
        ]}
      />
    </AdminLayout>
  );
}
