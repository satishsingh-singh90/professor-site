import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Profile', href: '/admin/professor' },
    { name: 'Research Areas', href: '/admin/research-areas' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Publications', href: '/admin/publications' },
    { name: 'Patents', href: '/admin/patents' },
    { name: 'Education', href: '/admin/education' },
    { name: 'Experience', href: '/admin/experience' },
    { name: 'Awards', href: '/admin/awards' },
    { name: 'Courses', href: '/admin/courses' },
    { name: 'Timetable & Schedule', href: '/admin/schedule' },
    { name: 'Blogs & Articles', href: '/admin/blogs' },
    { name: 'Newsletters & Bulletins', href: '/admin/newsletters' },
    { name: 'Testimonials', href: '/admin/testimonials' },
    { name: 'Gallery', href: '/admin/gallery' },
    { name: 'Social Links', href: '/admin/social-links' },
  ];

  const handleLogout = () => {
    // Clear simple auth cookie and localStorage flag
    document.cookie = 'admin_auth=; path=/; max-age=0;';
    localStorage.removeItem('admin_authenticated');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-ivory">
      <aside className="w-64 bg-navy text-white flex-shrink-0 p-4 overflow-y-auto h-screen sticky top-0">
        <h1 className="text-xl font-heading mb-6">📚 Admin</h1>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={`block px-3 py-2 rounded-lg text-sm transition hover:bg-white/10 cursor-pointer ${
                router.pathname === item.href ? 'bg-teal/20 text-teal' : ''
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-10 pt-6 border-t border-white/20 text-sm space-y-2">
          <button
            onClick={() => {
              document.cookie = 'admin_auth=; path=/; max-age=0;';
              localStorage.removeItem('admin_authenticated');
              router.push('/');
            }}
            className="block w-full text-left text-slateGray hover:text-white transition"
          >
            ← Back to Site
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-red-400 hover:text-red-300 transition text-sm"
          >
            Logout
          </button>
        </div>

      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-softGray">
          {children}
        </div>
      </main>
    </div>
  );
}