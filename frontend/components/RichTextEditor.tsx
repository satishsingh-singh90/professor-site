import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when `value` changes (e.g., editing an existing blog)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="border border-softGray rounded-lg p-4 text-slateGray">Loading editor...</div>;
  }

  // Helper to set a link
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-softGray rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-ivory border-b border-softGray p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          Numbered List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive('codeBlock') ? 'bg-teal text-white' : 'hover:bg-gray-200'}`}
        >
          Code Block
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) (editor.chain().focus() as any).setImage?.({ src: url })?.run?.();
          }}
          className="px-2 py-1 rounded text-sm hover:bg-gray-200"
        >
          Image
        </button>
      </div>


      {/* Editor Content */}
      {(() => {
        const Comp = EditorContent as any;
        return <Comp editor={editor} className="p-4 min-h-[250px] prose max-w-none" />;
      })()}
    </div>
  );
}