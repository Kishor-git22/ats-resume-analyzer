import type { Route } from './+types/home';
import Navbar from '~/components/Navbar';
import ResumeCard from '~/components/ResumeCard';
import { usePuterStore } from '~/lib/puter';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState, useRef } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'ATS RESUME ANALYZER' },
    { name: 'description', content: 'Smart feedback for your dream job!' },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auth check
  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  // Load resumes
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  // Auto infinite scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || resumes.length === 0) return;

    let interval: NodeJS.Timeout;

    if (!isPaused) {
      interval = setInterval(() => {
        slider.scrollLeft += 2; // speed

        // When we reach halfway (because list is duplicated), reset seamlessly
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }, 20);
    }

    return () => clearInterval(interval);
  }, [isPaused, resumes]);

  // Drag-to-scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add('cursor-grabbing');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
    };

    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover max-md:px-5">
      <Navbar />

      <section className="main-section grid grid-cols-1 md:grid-cols-2 max-md:pt-5 gap-8 items-start md:items-center">
        {/* Left Side - Text Content (shows first on mobile) */}
        <div className="page-heading md:sticky md:top-5 order-1 md:order-2">
          <h1 className="text-2xl md:text-lg max-md:text-xl font-bold text-gradient">
            Track Your Applications & Resume Ratings
          </h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {/* Right Side - Infinite Slider (shows second on mobile) */}
        <div className="order-2 md:order-2 max-md:mx-2">
          <div className="bg-gradient-to-r  from-purple-500/20 via-pink-500/10 to-blue-500/20 p-6 max-md:p-4 rounded-3xl">
            {/* Inner scrollable container */}
            <div
              ref={sliderRef}
              className="
          overflow-x-scroll cursor-grab relative scrollbar-hidden
          rounded-2xl
          scroll-px-6
        "
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex items-stretch gap-6 py-6 px-6 max-md:gap-4 max-md:py-4 max-md:px-4">
                {!loadingResumes && resumes?.length > 0 ? (
                  <>
                    {resumes.map((resume) => (
                      <div
                        key={`a-${resume.id}`}
                        className="
                    min-w-[280px] max-md:min-w-[240px] flex-shrink-0 rounded-xl bg-white shadow-md p-4
                    transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.05]
                  "
                      >
                        <ResumeCard resume={resume} />
                      </div>
                    ))}

                    {resumes.map((resume) => (
                      <div
                        key={`b-${resume.id}`}
                        className="
                    min-w-[280px] max-md:min-w-[240px] flex-shrink-0 rounded-xl bg-white shadow-md p-4
                    transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.05]
                  "
                      >
                        <ResumeCard resume={resume} />
                      </div>
                    ))}
                  </>
                ) : loadingResumes ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    <img src="/images/resume-scan-2.gif" className="w-[200px] max-md:w-[150px]" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-10 gap-4 w-full max-md:mt-6">
                    <h2 className="text-center max-md:text-sm">
                      No resumes found. Upload your first resume to get feedback.
                    </h2>
                    <Link
                      to="/upload"
                      className="primary-button w-fit text-xl max-md:text-lg font-semibold"
                    >
                      Upload Resume
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
