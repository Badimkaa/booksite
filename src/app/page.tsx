import { getChapters, getSettings, getCourses, getSchedule } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { BookTeaser } from '@/components/home/BookTeaser';
import { CoursesTeaser } from '@/components/home/CoursesTeaser';
import { MentorshipTeaser } from '@/components/home/MentorshipTeaser';
import { ScheduleTeaser } from '@/components/home/ScheduleTeaser';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [chapters, settings, courses, schedule] = await Promise.all([
    getChapters(),
    getSettings(),
    getCourses(),
    getSchedule()
  ]);
  const publishedChapters = chapters.filter((c) => c.published);
  const upcomingEvents = schedule.filter(e => new Date(e.date) > new Date()).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection settings={settings} />
      <AboutSection />
      <BookTeaser settings={settings} publishedChapters={publishedChapters} />
      <CoursesTeaser courses={courses} />
      <MentorshipTeaser />
      <ScheduleTeaser events={upcomingEvents} />
    </div>
  );
}

