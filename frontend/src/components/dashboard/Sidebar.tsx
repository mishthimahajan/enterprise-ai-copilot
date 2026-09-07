// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// import {
//   LayoutDashboard,
//   FolderGit2,
//   FileText,
//   Bot,
//   Settings,
//   LogOut,
//   UserCircle2,
// } from "lucide-react";

// const menuItems = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Repositories",
//     href: "/repositories",
//     icon: FolderGit2,
//   },
//   {
//     title: "Documents",
//     href: "/documents",
//     icon: FileText,
//   },
//   {
//     title: "AI Chat",
//     href: "/chat",
//     icon: Bot,
//   },
//   {
//     title: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ];

// type Props = {
//   user?: {
//     name: string;
//     role: string;
//     agent_id: string;
//   };
// };

// export default function Sidebar({ user }: Props) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const logout = () => {
//     localStorage.removeItem("token");
//     router.replace("/login");
//   };

//   return (
//     <aside className="flex h-screen w-72 flex-col border-r bg-white">

//       {/* Logo */}

//       <div className="border-b p-6">

//         <h1 className="text-2xl font-bold text-blue-600">
//           Enterprise AI
//         </h1>

//         <p className="text-sm text-slate-500">
//           Operations Copilot
//         </p>

//       </div>

//       {/* User */}

//       <div className="border-b p-6">

//         <div className="flex items-center gap-4">

//           <UserCircle2
//             size={52}
//             className="text-blue-600"
//           />

//           <div>

//             <h2 className="font-semibold">
//               {user?.name || "Guest"}
//             </h2>

//             <p className="text-sm text-slate-500">
//               {user?.role || ""}
//             </p>

//             <p className="text-xs text-slate-400">
//               {user?.agent_id || ""}
//             </p>

//           </div>

//         </div>

//       </div>

      

//       <nav className="flex-1 px-4 py-6">

//         <div className="space-y-2">

//           {menuItems.map((item) => {
//             const Icon = item.icon;

//             const active = pathname === item.href;

//             return (
//               <Link
//                 key={item.title}
//                 href={item.href}
//                 className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
//                   active
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 <Icon size={20} />

//                 <span>{item.title}</span>
//               </Link>
//             );
//           })}

//         </div>

//       </nav>

     

//       <div className="border-t p-4">

//         <button
//           onClick={logout}
//           className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>

//       </div>

//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Bot,
  Settings,
  LogOut,
  UserCircle2,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Repositories",
    href: "/repositories",
    icon: FolderGit2,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

type Props = {
  user?: {
    name: string;
    role: string;
    agent_id: string;
  };
};

export default function Sidebar({
  user,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const { logoutUser } = useAuth();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    /*
     * logoutUser clears:
     *
     * access_token
     * selected_agent_id
     * selected_document_id
     * selected_repository_id
     */

    logoutUser();

    // Replace instead of push so the user
    // cannot simply go "Back" to the dashboard.
    router.replace("/login");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* ======================================
          LOGO
      ======================================= */}

      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Enterprise AI
        </h1>

        <p className="text-sm text-slate-500">
          Operations Copilot
        </p>
      </div>

      {/* ======================================
          USER
      ======================================= */}

      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <UserCircle2
            size={52}
            className="shrink-0 text-blue-600"
          />

          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-900">
              {user?.name || "User"}
            </h2>

            {user?.role && (
              <p className="truncate text-sm text-slate-500">
                {user.role}
              </p>
            )}

            {user?.agent_id && (
              <p className="truncate text-xs text-slate-400">
                {user.agent_id}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ======================================
          NAVIGATION
      ======================================= */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon
                  size={20}
                  className="shrink-0"
                />

                <span>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ======================================
          LOGOUT
      ======================================= */}

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />

          Logout
        </button>
      </div>
    </aside>
  );
}