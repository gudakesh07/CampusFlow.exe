import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Search,
  Brain,
  Sparkles,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Pin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "student" | "faculty" | "admin";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Exam Tomorrow!",
      description: "Midterm for PHYS-301 is tomorrow at 9 AM.",
      important: true,
      read: false,
    },
    {
      id: 2,
      title: "New material uploaded",
      description: "Dr. Smith uploaded lecture slides for CS-101.",
      important: false,
      read: false,
    },
    {
      id: 3,
      title: "Assignment graded",
      description: "Your Physics Lab 3 has been graded.",
      important: false,
      read: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const menuItems = {
    student: [
      {
        icon: LayoutDashboard,
        label: "Overview",
        path: "/dashboard/student",
        implemented: true,
      },
      {
        icon: Calendar,
        label: "Timetable",
        path: "/dashboard/student/schedule",
        implemented: true,
      },
      {
        icon: BookOpen,
        label: "Courses",
        path: "/dashboard/student/courses",
        implemented: true,
      },
      {
        icon: Brain,
        label: "AI Study Hub",
        path: "/dashboard/student/ai",
        implemented: true,
      },
      {
        icon: MessageSquare,
        label: "Messages",
        path: "/dashboard/student/messages",
        implemented: true,
      },
    ],
    faculty: [
      {
        icon: LayoutDashboard,
        label: "Faculty Hub",
        path: "/dashboard/faculty",
        implemented: true,
      },
      {
        icon: BookOpen,
        label: "My Classes",
        path: "/dashboard/faculty/classes",
        implemented: true,
      },
      {
        icon: Calendar,
        label: "Exam Planner",
        path: "/dashboard/faculty/exams",
        implemented: true,
      },
      {
        icon: MessageSquare,
        label: "Student Groups",
        path: "/dashboard/faculty/messages",
        implemented: true,
      },
    ],
    admin: [
      {
        icon: LayoutDashboard,
        label: "Institution Ops",
        path: "/dashboard/admin",
        implemented: true,
      },
      {
        icon: ChevronRight,
        label: "Manage Faculty",
        path: "/dashboard/admin/faculty",
        implemented: false,
      },
      {
        icon: ChevronRight,
        label: "Manage Students",
        path: "/dashboard/admin/students",
        implemented: false,
      },
      {
        icon: Settings,
        label: "System Config",
        path: "/dashboard/admin/config",
        implemented: false,
      },
    ],
  };

  const currentMenu = menuItems[role];

  const handleNotImplemented = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("This feature is currently in development for the prototype.");
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/10 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Logo className="w-5 h-5" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            CampusFlow
          </span>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">
            Main Menu
          </p>
          {currentMenu.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== `/dashboard/${role}` &&
                location.pathname.startsWith(item.path));

            if (!item.implemented) {
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={handleNotImplemented}
                  className="w-full justify-start gap-3 rounded-xl h-11 px-4 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Button>
              );
            }

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 rounded-xl h-11 px-4 transition-all duration-200 ${
                    isActive
                      ? "bg-secondary text-foreground shadow-sm"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-primary" : ""}`}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="p-4 mt-auto">
          <div
            onClick={handleNotImplemented}
            className="bg-primary/5 rounded-2xl p-4 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <p className="text-xs font-semibold text-primary/80 mb-2 flex items-center gap-1">
              <Brain className="w-3 h-3" /> AI Assistant Ready
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Ask about your assignments or notes instantly.
            </p>
          </div>
          <Separator className="my-4 opacity-50" />
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Sign Out</span>
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Header */}
        <header className="h-20 pt-[10px] border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleNotImplemented}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments, files, or groups..."
                className="pl-10 h-10 bg-muted/30 border-none rounded-xl focus-visible:ring-primary/20 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />

              {isSearchOpen && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
                  <div className="p-2 text-xs font-semibold text-muted-foreground bg-muted/30">
                    Search Results for "{searchQuery}"
                  </div>
                  <div className="p-2 flex flex-col">
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 rounded-lg text-sm font-normal"
                      onClick={() => {
                        toast.success(
                          `Navigating to assignment matches for ${searchQuery}`,
                        );
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                    >
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>
                        View assignments matching{" "}
                        <span className="font-semibold">{searchQuery}</span>
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 rounded-lg text-sm font-normal"
                      onClick={() => {
                        toast.success(`Found files related to ${searchQuery}`);
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                    >
                      <Pin className="w-4 h-4 text-rose-500" />
                      <span>
                        Pinned files for{" "}
                        <span className="font-semibold">{searchQuery}</span>
                      </span>
                    </Button>
                    {searchQuery.length > 3 && (
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 rounded-lg text-sm font-normal"
                        onClick={() => {
                          toast.info(
                            `Asking AI Assistant about ${searchQuery}`,
                          );
                          setSearchQuery("");
                          setIsSearchOpen(false);
                        }}
                      >
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span>
                          Ask AI Assistant about{" "}
                          <span className="font-semibold text-purple-500">
                            {searchQuery}
                          </span>
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative hover:bg-muted/50"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 mr-4 mt-2 bg-background shadow-lg border-border"
                align="end"
                sideOffset={5}
              >
                <div className="p-4 border-b border-border/50 bg-background rounded-t-md">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                </div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto bg-background rounded-b-md">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors flex gap-3"
                      >
                        {notif.important ? (
                          <div className="mt-0.5 shrink-0 grow-0 h-4 w-4 rounded-full flex items-center justify-center bg-destructive/10 text-destructive">
                            <Pin className="w-3 h-3" />
                          </div>
                        ) : (
                          <Checkbox
                            id={`notif-${notif.id}`}
                            className="mt-0.5 rounded-sm"
                            onCheckedChange={() =>
                              handleDismissNotification(notif.id)
                            }
                          />
                        )}
                        <div className="flex-1 space-y-1">
                          <label
                            htmlFor={`notif-${notif.id}`}
                            className={`text-sm font-medium leading-none tracking-tight ${notif.important ? "text-foreground" : "text-foreground cursor-pointer"}`}
                          >
                            {notif.title}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {notif.description}
                          </p>
                          {notif.important && (
                            <p className="text-[10px] text-destructive font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> Pinned by
                              instructor
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <div
              onClick={handleNotImplemented}
              className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">
                  {user?.displayName || "Demo User"}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-1 capitalize">
                  {role}
                </p>
              </div>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 max-w-7xl mx-auto min-h-full flex flex-col"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
