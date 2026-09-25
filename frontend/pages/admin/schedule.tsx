import AdminLayout from '@/components/AdminLayout';
import CrudManager from '@/components/CrudManager';

export default function AdminSchedule() {
  return (
    <AdminLayout>
      <CrudManager
        title="Professor Timetable & Office Hours"
        apiPath="schedules"
        fields={[
          {
            name: 'day_of_week',
            label: 'Day of Week',
            type: 'select',
            required: true,
            options: [
              { value: 'Monday', label: 'Monday' },
              { value: 'Tuesday', label: 'Tuesday' },
              { value: 'Wednesday', label: 'Wednesday' },
              { value: 'Thursday', label: 'Thursday' },
              { value: 'Friday', label: 'Friday' },
              { value: 'Saturday', label: 'Saturday' },
            ]
          },
          { name: 'start_time', label: 'Start Time (e.g. 09:30 AM or 02:00 PM)', type: 'text', required: true },
          { name: 'end_time', label: 'End Time (e.g. 11:00 AM or 03:30 PM)', type: 'text', required: true },
          { name: 'title', label: 'Activity / Subject Title (e.g. Open Office Hours, Lecture)', type: 'text', required: true },
          {
            name: 'slot_type',
            label: 'Slot Type',
            type: 'select',
            options: [
              { value: 'office_hours', label: 'Open Office Hours (Available for Students)' },
              { value: 'lecture', label: 'Lecture / Teaching Class (Busy)' },
              { value: 'lab', label: 'Lab Supervision (Busy)' },
              { value: 'meeting', label: 'Departmental / Research Meeting (Busy)' },
              { value: 'busy', label: 'Other Busy Commitment' }
            ]
          },
          { name: 'location', label: 'Location (e.g. Faculty Cabin #312, CS Block or LT-2)', type: 'text' },
          { name: 'notes', label: 'Notes (e.g. Student advising, thesis mentoring, etc.)', type: 'textarea' },
        ]}
      />
    </AdminLayout>
  );
}
