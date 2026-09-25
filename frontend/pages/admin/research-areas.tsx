import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';
import { Sparkles, Info } from 'lucide-react';

export default function AdminResearchAreas() {
  return (
    <AdminLayout>
      <div className="mb-6 bg-teal/10 border border-teal/20 rounded-xl p-4 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold text-navy">Front Page Dynamic Topics & Research Manifesto</p>
          <p className="text-slateGray mt-1">
            Every topic you add or update here automatically feeds into the <strong>Front Page Hero Rotating Manifesto (changes every 5s)</strong>, the <strong>Primary Research Domains Carousel</strong>, and the dedicated <strong>Research Page</strong>.
          </p>
        </div>
      </div>

      <CrudManager
        title="Research Focus Areas & Topics"
        apiPath="research-areas"
        fields={[
          { 
            name: 'name', 
            label: 'Topic Name / Focus Title (e.g. AI in Clinical Diagnostics)', 
            type: 'text', 
            required: true 
          },
          { 
            name: 'description', 
            label: '2-3 Line Research Manifesto / Statement', 
            type: 'textarea',
            required: true
          },
        ]}
      />
    </AdminLayout>
  );
}
