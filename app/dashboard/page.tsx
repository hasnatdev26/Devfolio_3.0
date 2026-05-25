export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 sm:text-sm">Overview</p>
        <h1 className="mt-2 text-xl font-bold leading-tight text-slate-900 sm:mt-3 sm:text-3xl lg:text-4xl">
          Welcome back, Admin
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
          TailAdmin inspired UI is now active in your portfolio dashboard. Manage your profile, projects,
          messages, and settings from the left panel.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Total Projects</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">12</p>
          <p className="mt-1 text-xs font-medium text-emerald-600">+8.2% from last month</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Pending Tasks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">5</p>
          <p className="mt-1 text-xs font-medium text-amber-600">2 tasks due today</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Messages</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">8</p>
          <p className="mt-1 text-xs font-medium text-sky-600">3 unread conversations</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Profile Status</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">96%</p>
          <p className="mt-1 text-xs font-medium text-indigo-600">Almost complete</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-800">New project added to portfolio</p>
              <p className="text-xs text-slate-500">10 minutes ago</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-800">Profile image was updated</p>
              <p className="text-xs text-slate-500">1 hour ago</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-800">Contact message received</p>
              <p className="text-xs text-slate-500">3 hours ago</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Notes</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep your latest projects first in the list so visitors can instantly see your best recent work.
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-lg border border-indigo-500/50 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Go To Projects
          </button>
        </div>
      </div>
    </div>
  );
}
