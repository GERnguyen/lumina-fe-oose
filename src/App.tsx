import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AppInitializer } from "./components/AppInitializer";
import InstructorLayout from "./layouts/InstructorLayout";
import CreateCourseLayout from "./layouts/CreateCourseLayout";
import StudentDashboardLayout from "./layouts/StudentDashboardLayout";
import Cart from "./pages/Cart";
import ComingSoon from "./pages/ComingSoon";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import BasicInformation from "./pages/instructor/CreateCourseBasic";
import AdvanceInformation from "./pages/instructor/AdvanceInformation";
import CreateCourseCurriculum from "./pages/instructor/CreateCourseCurriculum";
import CreateCoursePublish from "./pages/instructor/CreateCoursePublish";
import InstructorMyCourses from "./pages/instructor/MyCourses";
import DashboardOverview from "./pages/student/DashboardOverview";
import StudentCourses from "./pages/student/StudentCourses";
import StudentPurchaseHistory from "./pages/student/StudentPurchaseHistory";
import StudentSettings from "./pages/student/StudentSettings";
import WatchCourse from "./pages/student/WatchCourse";
import { ProtectedRoute } from "./components/ProtectedRoute";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <>
      <AppInitializer />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Navigate to="/cart" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/learning/course/:courseId" element={<WatchCourse />} />
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<InstructorMyCourses />} />
            <Route path="create-course" element={<CreateCourseLayout />}>
              <Route index element={<Navigate to="basic" replace />} />
              <Route path="basic" element={<BasicInformation />} />
              <Route path="advance" element={<AdvanceInformation />} />
              <Route path="curriculum" element={<CreateCourseCurriculum />} />
              <Route path="publish" element={<CreateCoursePublish />} />
            </Route>
          </Route>
          <Route path="/student" element={<StudentDashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route
              path="purchase-history"
              element={<StudentPurchaseHistory />}
            />
            <Route path="settings" element={<StudentSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
