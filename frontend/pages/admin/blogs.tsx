import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';
import { BookOpen, Globe, Sparkles } from 'lucide-react';

export default function AdminBlogs() {
  return (
    <AdminLayout>
      <div className="mb-6 bg-teal/10 border border-teal/20 rounded-xl p-4 flex items-start space-x-3">
        <BookOpen className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold text-navy">Academic Blogs & External Thought Leadership</p>
          <p className="text-slateGray mt-1">
            Manage your articles published on <strong>Medium, Google Blogger, Substack, LinkedIn Pulse, or your personal blog</strong>.
            Items added here are showcased on the dedicated public <strong>/blog</strong> page with live preview cards, direct read links, and platform badges.
          </p>
          <div className="mt-2 flex items-center space-x-4 text-xs font-medium text-teal">
            <span className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Supports Medium, Blogger, Substack, etc.</span>
            </span>
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live on /blog</span>
            </span>
          </div>
        </div>
      </div>

      <CrudManager
        title="Academic Blogs & Articles"
        apiPath="blogs"
        fields={[
          { 
            name: 'title', 
            label: 'Blog Title (e.g. Edge AI and IoT Deployments in Healthcare)', 
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
            name: 'description', 
            label: 'Small Description / Abstract (2-3 concise sentences summarizing the article)', 
            type: 'textarea',
            required: true
          },
          { 
            name: 'image_url', 
            label: 'Cover Image URL (e.g. https://images.unsplash.com/... or hosted banner image)', 
            type: 'url',
            required: false
          },
          { 
            name: 'link', 
            label: 'Blog Hosted URL (e.g. https://medium.com/@drprabdeep/... or https://prabdeepsingh.blogspot.com/...)', 
            type: 'url',
            required: true
          },
          { 
            name: 'slug', 
            label: 'Slug / Reference Identifier (e.g. edge-ai-iot-healthcare)', 
            type: 'text',
            required: false
          },
        ]}
      />
    </AdminLayout>
  );
}
