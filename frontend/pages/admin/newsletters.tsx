import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';
import { Newspaper } from 'lucide-react';

export default function AdminNewsletters() {
  return (
    <AdminLayout>
      <div className="mb-6 bg-teal/10 border border-teal/20 rounded-xl p-4 flex items-start space-x-3">
        <Newspaper className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold text-navy">Lab Newsletters, Dispatches & Bulletins</p>
          <p className="text-slateGray mt-1">
            Publish academic announcements, student recruitment notices, lab milestones, and newsletters.
            These items appear on the public <strong>/updates</strong> page.
          </p>
        </div>
      </div>

      <CrudManager
        title="Lab Newsletters & Bulletins"
        apiPath="newsletters"
        fields={[
          { 
            name: 'title', 
            label: 'Newsletter / Announcement Headline (e.g. PhD Positions Open in IoT & Edge AI)', 
            type: 'text', 
            required: true 
          },
          { 
            name: 'research_area_id', 
            label: 'Research Area (Knowledge Graph)', 
            type: 'select', 
            optionsFrom: 'research-areas' 
          },
          { 
            name: 'tag', 
            label: 'Category Tag (e.g. Lab Opening, Milestone, Grant, Award, Conference)', 
            type: 'text',
            required: false
          },
          { 
            name: 'content', 
            label: 'Bulletin Summary / Full Announcement Text', 
            type: 'textarea',
            required: true
          },
          { 
            name: 'link', 
            label: 'Optional External Reference / Application URL', 
            type: 'url',
            required: false
          },
        ]}
      />
    </AdminLayout>
  );
}
