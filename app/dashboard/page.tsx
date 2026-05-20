export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Overview</p>
        <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">Welcome to Dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          This is your dashboard overview page. Use the left sidebar to navigate profile, projects,
          and settings sections.
        </p>
      </div>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Total Projects</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Pending Tasks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2 xl:col-span-1">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Messages</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">8</p>
        </div>
      </div>
    </div>
  );
}
