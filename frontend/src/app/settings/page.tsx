"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Save,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Mishthi Mahajan");
  const [email, setEmail] = useState("mishthimahajan@gmail.com");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
  
    localStorage.setItem(
      "userSettings",
      JSON.stringify({
        name,
        email,
        notifications,
        emailNotifications,
        darkMode,
      })
    );

    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account and Enterprise AI preferences
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit rounded-xl border bg-white p-3">
            <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium text-blue-600">
              <User size={18} />
              Profile
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50">
              <Bell size={18} />
              Notifications
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50">
              <Shield size={18} />
              Security
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50">
              <Palette size={18} />
              Appearance
            </button>

            <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50">
              <Key size={18} />
              API Keys
            </button>
          </aside>

         
          <main className="space-y-6">

            
            <section className="rounded-xl border bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Profile
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>
            </section>

            
            <section className="rounded-xl border bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Bell size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Notifications
                  </h2>

                  <p className="text-sm text-slate-500">
                    Control how you receive notifications
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      In-app notifications
                    </p>

                    <p className="text-sm text-slate-500">
                      Receive notifications inside Enterprise AI
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) =>
                      setNotifications(e.target.checked)
                    }
                    className="h-5 w-5 accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      Email notifications
                    </p>

                    <p className="text-sm text-slate-500">
                      Receive important updates through email
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) =>
                      setEmailNotifications(e.target.checked)
                    }
                    className="h-5 w-5 accent-blue-600"
                  />
                </div>

              </div>
            </section>

           
            <section className="rounded-xl border bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Palette size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Appearance
                  </h2>

                  <p className="text-sm text-slate-500">
                    Customize the appearance of your workspace
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    Dark mode
                  </p>

                  <p className="text-sm text-slate-500">
                    Use a dark theme for the application
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="h-5 w-5 accent-blue-600"
                />
              </div>
            </section>

           
            <section className="rounded-xl border bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Shield size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Security
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage your account security
                  </p>
                </div>
              </div>

              <button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Change Password
              </button>
            </section>

            
            <div className="flex items-center justify-between rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">
                Save your changes before leaving this page.
              </p>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>

            
            <section className="rounded-xl border border-red-100 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Sign out
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Sign out from your Enterprise AI account.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}