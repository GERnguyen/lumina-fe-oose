import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import adminService, { type AdminUserRole } from "../../services/admin.service";

type MainTabKey = "users" | "courses";

function formatDateTime(value: string): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [mainTab, setMainTab] = useState<MainTabKey>("users");
  const [userRoleTab, setUserRoleTab] = useState<AdminUserRole>("student");

  const handleSignOut = () => {
    logout();
    queryClient.clear();
    navigate("/sign-in", { replace: true });
  };

  const usersQuery = useQuery({
    queryKey: ["admin", "users", userRoleTab],
    queryFn: () => adminService.getUsersByRole(userRoleTab),
    enabled: mainTab === "users",
  });

  const pendingCoursesQuery = useQuery({
    queryKey: ["admin", "pending-courses"],
    queryFn: () => adminService.getPendingCourses(),
    enabled: mainTab === "courses",
  });

  const approveMutation = useMutation({
    mutationFn: (courseId: number) => adminService.approveCourse(courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "pending-courses"],
      });
    },
  });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const pendingCourses = useMemo(
    () => pendingCoursesQuery.data ?? [],
    [pendingCoursesQuery.data],
  );

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-neutral-800">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý người dùng và duyệt khóa học chờ xuất bản.
          </p>
        </div>
        <Button
          variant="outline"
          colorScheme="gray"
          size="sm"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>

      <div className="flex gap-2 rounded-xl border border-gray-200 bg-white p-2">
        <Button
          variant={mainTab === "users" ? "solid" : "ghost"}
          colorScheme={mainTab === "users" ? "primary" : "gray"}
          size="sm"
          onClick={() => setMainTab("users")}
        >
          Quản lý người dùng
        </Button>
        <Button
          variant={mainTab === "courses" ? "solid" : "ghost"}
          colorScheme={mainTab === "courses" ? "primary" : "gray"}
          size="sm"
          onClick={() => setMainTab("courses")}
        >
          Duyệt khóa học
        </Button>
      </div>

      {mainTab === "users" ? (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <Button
              variant={userRoleTab === "student" ? "solid" : "ghost"}
              colorScheme={userRoleTab === "student" ? "secondary" : "gray"}
              size="sm"
              onClick={() => setUserRoleTab("student")}
            >
              Students
            </Button>
            <Button
              variant={userRoleTab === "instructor" ? "solid" : "ghost"}
              colorScheme={userRoleTab === "instructor" ? "secondary" : "gray"}
              size="sm"
              onClick={() => setUserRoleTab("instructor")}
            >
              Giảng viên
            </Button>
          </div>

          {usersQuery.isLoading ? (
            <p className="text-sm text-gray-500">
              Đang tải danh sách người dùng...
            </p>
          ) : null}

          {usersQuery.isError ? (
            <p className="text-sm text-danger-600">
              Không thể tải danh sách người dùng.
            </p>
          ) : null}

          {!usersQuery.isLoading &&
          !usersQuery.isError &&
          users.length === 0 ? (
            <p className="text-sm text-gray-500">Không có người dùng nào.</p>
          ) : null}

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-medium text-neutral-700">
                    {formatDateTime(user.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
          {pendingCoursesQuery.isLoading ? (
            <p className="text-sm text-gray-500">
              Đang tải khóa học chờ duyệt...
            </p>
          ) : null}

          {pendingCoursesQuery.isError ? (
            <p className="text-sm text-danger-600">
              Không thể tải danh sách khóa học chờ duyệt.
            </p>
          ) : null}

          {!pendingCoursesQuery.isLoading &&
          !pendingCoursesQuery.isError &&
          pendingCourses.length === 0 ? (
            <p className="text-sm text-gray-500">
              Hiện không có khóa học nào chờ duyệt.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pendingCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="h-44 w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="line-clamp-2 text-base font-semibold text-neutral-800">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Giảng viên: {course.instructorName} (
                      {course.instructorEmail})
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Gửi duyệt lúc: {formatDateTime(course.createdAt)}
                    </p>
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-600">
                    {course.description || "Không có mô tả."}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      to={`/instructor/courses/${course.id}/manage`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" colorScheme="gray" size="sm">
                        Xem nội dung
                      </Button>
                    </Link>
                    <Button
                      colorScheme="primary"
                      size="sm"
                      onClick={() => approveMutation.mutate(course.id)}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending
                        ? "Đang duyệt..."
                        : "Duyệt khóa học"}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
