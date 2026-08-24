"use client";

interface Activity {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  timestamp?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

export default function RecentActivity({
  activities = [],
}: RecentActivityProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-500">
            Your latest activity
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id ?? index}
              className="flex items-start gap-3"
            >
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {activity.title ?? "Activity"}
                </p>

                {activity.description && (
                  <p className="text-xs text-slate-500">
                    {activity.description}
                  </p>
                )}

                {activity.timestamp && (
                  <p className="text-xs text-slate-400 mt-1">
                    {activity.timestamp}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}