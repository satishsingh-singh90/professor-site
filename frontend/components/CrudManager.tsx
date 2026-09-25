import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RichTextEditor from './RichTextEditor';

export type FieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'url' | 'select' | 'richtext';
  options?: { value: string | number; label: string }[];
  optionsFrom?: 'research-areas';
  required?: boolean;
};

type CrudManagerProps = {
  title: string;
  apiPath: string;
  fields: FieldConfig[];
  validationSchema?: z.ZodObject<any>;
};

export default function CrudManager({ title, apiPath, fields, validationSchema }: CrudManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [researchAreas, setResearchAreas] = useState<{ id: number; name: string }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultSchema = z.object(
    Object.fromEntries(
      fields.map((f) => {
        let validator: any;
        if (f.name === 'research_area_id') {
          validator = z.any().optional().nullable();
        } else if (f.type === 'number') {
          validator = f.required
            ? z.coerce.number({ invalid_type_error: `${f.label} must be a number` })
            : z.coerce.number().optional().nullable();
        } else if (f.type === 'url') {
          validator = f.required
            ? z.string().url(`${f.label} must be a valid URL`)
            : z.string().url(`${f.label} must be a valid URL`).or(z.literal('')).optional();
        } else {
          validator = f.required
            ? z.string().min(1, `${f.label} is required`)
            : z.string().optional().nullable();
        }
        return [f.name, validator];
      })
    )
  );

  const schema = validationSchema || defaultSchema;
  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchResearchAreas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/research-areas`);
      setResearchAreas(res.data || []);
    } catch (e) {
      console.warn('Could not fetch research areas for dropdown', e);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/${apiPath}`);
      setItems(res.data);
    } catch (e) {
      console.error('Failed to fetch', e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
    if (fields.some(f => f.optionsFrom === 'research-areas' || f.name === 'research_area_id')) {
      fetchResearchAreas();
    }
  }, [apiPath]);

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data };
      if ('research_area_id' in payload) {
        if (payload.research_area_id === '' || payload.research_area_id === null || payload.research_area_id === undefined) {
          payload.research_area_id = null;
        } else {
          payload.research_area_id = parseInt(String(payload.research_area_id), 10);
        }
      }

      if (editingId) {
        await axios.put(`${API_BASE_URL}/admin/${apiPath}/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/admin/${apiPath}`, payload);
      }
      reset();
      setEditingId(null);
      fetchItems();
    } catch (e) {
      alert('Error saving data');
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/${apiPath}/${id}`);
      fetchItems();
    } catch (e) {
      alert('Delete failed');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    const formData: any = {};
    fields.forEach((f) => {
      formData[f.name] = item[f.name] ?? '';
    });
    reset(formData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="text-2xl font-heading text-navy mb-6">{title}</h1>

      <div className="bg-ivory p-6 rounded-xl border border-softGray mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-navy mb-4">
          {editingId ? `Edit ${title.replace(/s$/, '')}` : `Add New ${title.replace(/s$/, '')}`}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => {
            const isFullWidth = field.type === 'textarea' || field.type === 'richtext';
            return (
              <div key={field.name} className={isFullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'richtext' ? (
                  <RichTextEditor
                    value={getValues(field.name) || ''}
                    onChange={(html) => setValue(field.name, html)}
                  />
                ) : field.type === 'textarea' ? (
                  <textarea
                    {...register(field.name)}
                    className="w-full border border-softGray rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
                    rows={4}
                  />
                ) : field.type === 'select' || field.optionsFrom === 'research-areas' || field.name === 'research_area_id' ? (
                  <select
                    {...register(field.name)}
                    className="w-full border border-softGray rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
                  >
                    <option value="">{field.name === 'research_area_id' ? '-- Cross-Cutting / General (No Specific Area) --' : 'Select...'}</option>
                    {field.optionsFrom === 'research-areas' || field.name === 'research_area_id'
                      ? researchAreas.map((ra) => (
                          <option key={ra.id} value={ra.id}>
                            🔬 {ra.name}
                          </option>
                        ))
                      : field.options?.map((opt) => (
                          <option key={String(opt.value)} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    {...register(field.name)}
                    className="w-full border border-softGray rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
                  />
                )}

                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">{String(errors[field.name]?.message)}</p>
                )}
              </div>
            );
          })}

          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-navy/90 transition shadow-sm font-medium"
            >
              {editingId ? 'Update Record' : 'Save Record'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { reset({}); setEditingId(null); }}
                className="bg-softGray text-charcoal px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slateGray">Loading items...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-softGray shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-left border-b border-softGray">
              <tr>
                <th className="p-3 font-medium text-slateGray">ID</th>
                {fields.slice(0, 4).map((f) => (
                  <th key={f.name} className="p-3 font-medium text-slateGray">{f.label}</th>
                ))}
                <th className="p-3 font-medium text-slateGray text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-softGray hover:bg-ivory/50 transition">
                  <td className="p-3 text-slateGray font-mono">{item.id}</td>
                  {fields.slice(0, 4).map((f) => {
                    let cellVal = item[f.name];
                    if (f.name === 'research_area_id' && item.research_area_id) {
                      const matched = researchAreas.find(ra => ra.id === item.research_area_id);
                      cellVal = matched ? `🔬 ${matched.name}` : `Area #${item.research_area_id}`;
                    }
                    return (
                      <td key={f.name} className="p-3 text-charcoal truncate max-w-[200px]">
                        {cellVal ? String(cellVal) : <span className="text-gray-400">—</span>}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-teal hover:underline font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 2} className="p-8 text-center text-slateGray">
                    No records found. Use the form above to add your first entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}