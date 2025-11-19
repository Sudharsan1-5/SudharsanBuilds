// Reusable loading skeleton components for better UX

export const ServiceCardSkeleton = () => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-slate-100 animate-pulse">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-2xl"></div>
    </div>
    <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
    <div className="space-y-2 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 bg-slate-200 rounded w-full"></div>
      ))}
    </div>
    <div className="h-12 bg-slate-200 rounded-full w-full"></div>
  </div>
);

export const ProjectCardSkeleton = () => (
  <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 animate-pulse">
    <div className="h-48 bg-slate-700"></div>
    <div className="p-6">
      <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 bg-slate-700 rounded-full w-16"></div>
        ))}
      </div>
    </div>
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="bg-slate-800 p-5 md:p-8 rounded-2xl shadow-xl border border-slate-700 animate-pulse">
    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-700 rounded-full flex-shrink-0"></div>
      <div className="min-w-0 flex-1">
        <div className="h-5 bg-slate-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
    <div className="flex gap-1 mb-3 md:mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 md:w-5 md:h-5 bg-slate-700 rounded"></div>
      ))}
    </div>
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-700 rounded w-full"></div>
      ))}
      <div className="h-4 bg-slate-700 rounded w-4/5"></div>
    </div>
  </div>
);
