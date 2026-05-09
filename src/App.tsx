import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAIHub from "./pages/StudentAIHub";
import TimetablePage from "./pages/TimetablePage";
import CommunicationHub from "./pages/CommunicationHub";
import StudentCoursesPage from "./pages/StudentCoursesPage";
import CourseOverviewPage from "./pages/CourseOverviewPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyClassesPage from "./pages/FacultyClassesPage";
import FacultyExamsPage from "./pages/FacultyExamsPage";
import FacultyGroupsPage from "./pages/FacultyGroupsPage";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ClassProvider } from "./contexts/ClassContext";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="campus-flow-theme">
      <AuthProvider>
        <ClassProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes (Static for now until Firebase is ready) */}
              <Route path="/dashboard/student/*" element={
                <Routes>
                  <Route index element={<StudentDashboard />} />
                  <Route path="courses" element={<StudentCoursesPage />} />
                  <Route path="courses/:courseId" element={<CourseOverviewPage />} />
                  <Route path="ai" element={<StudentAIHub />} />
                  <Route path="schedule" element={<TimetablePage />} />
                  <Route path="messages" element={<CommunicationHub />} />
                  <Route path="messages/:groupId" element={<CommunicationHub />} />
                </Routes>
              } />
              <Route path="/dashboard/faculty/*" element={
                <Routes>
                  <Route index element={<FacultyDashboard />} />
                  <Route path="classes" element={<FacultyClassesPage />} />
                  <Route path="exams" element={<FacultyExamsPage />} />
                  <Route path="messages" element={<FacultyGroupsPage />} />
                </Routes>
              } />
              <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ClassProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
