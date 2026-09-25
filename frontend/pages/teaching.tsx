import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Calendar, Users, Sparkles, GraduationCap } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Teaching() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/courses`)
      .then(res => { 
        setCourses(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Teaching & Courses — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Undergraduate and graduate courses in Artificial Intelligence, Machine Learning, and Computer Systems." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Curriculum & Pedagogy</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Teaching & Course Directory
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Curated courses designed to bridge theoretical computer science, machine learning foundations, and real-world clinical application.
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600">No courses published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, idx) => (
              <div key={course.id || idx} className="academic-card p-6 flex flex-col justify-between space-y-4 hover:border-ink-300 transition">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    {course.code && (
                      <span className="badge-tag bg-scholar-navy/10 text-scholar-navy font-bold">
                        {course.code}
                      </span>
                    )}
                    {course.semester && (
                      <span className="text-xs font-mono text-ink-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-ink-400" />
                        <span>{course.semester}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-heading text-xl font-bold text-ink-900 leading-snug">
                    {course.title}
                  </h2>

                  {course.description && (
                    <p className="text-sm text-ink-600 leading-relaxed font-sans">
                      {course.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-academic-borderLight flex items-center justify-between text-xs">
                  <Link
                    href={`/ai-assistant?q=${encodeURIComponent(`What is covered in the course ${course.title}?`)}`}
                    className="text-scholar-teal hover:underline font-semibold inline-flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask ProfAI about this course</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
