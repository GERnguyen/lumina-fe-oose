# Giai Đoạn 1: Authentication Layer - Tài Liệu Triển Khai

## 📋 Tóm Tắt

Đã hoàn thành triển khai Data Layer và tích hợp API Đăng nhập (Authentication) cho ứng dụng Frontend Cinx E-learning.

---

## ✅ Những Gì Đã Hoàn Thành

### 1. **Cài Đặt Thư Viện Lõi**

```bash
npm install axios zustand @tanstack/react-query react-hook-form @hookform/resolvers zod
```

**Thư viện:**

- `axios`: HTTP client
- `zustand`: Global state management
- `@tanstack/react-query`: Data fetching & caching
- `react-hook-form`: Form state management
- `@hookform/resolvers & zod`: Form validation

---

### 2. **Cấu Hình Axios Client** (`src/api/axiosClient.ts`)

**Tính năng:**

- Base URL: `http://localhost:9090/api`
- **Request Interceptor:** Tự động gắn token từ localStorage vào Authorization header
- **Response Interceptor:**
  - Trả về `response.data`
  - Xử lý lỗi 401: Xóa token & chuyển hướng tới `/login`

```typescript
// Sử dụng
import axiosClient from "@/api/axiosClient";
const data = await axiosClient.get("/courses");
```

---

### 3. **Global State Management** (`src/stores/useAuthStore.ts`)

**State:**

```typescript
interface AuthState {
  user: User | null; // Thông tin user đăng nhập
  token: string | null; // JWT token
  isAuthenticated: boolean; // Trạng thái đăng nhập
}
```

**Actions:**

- `setAuth(user, token)`: Lưu auth state và token vào localStorage
- `logout()`: Xóa auth state & token khỏi localStorage
- `recover()`: Khôi phục token từ localStorage (dùng khi app reload)

**Sử dụng:**

```typescript
import { useAuthStore } from "@/stores/useAuthStore";

const user = useAuthStore((state) => state.user);
const { setAuth, logout } = useAuthStore();
```

---

### 4. **API Service** (`src/services/auth.service.ts`)

**Hàm:**

```typescript
authService.login(credentials: LoginCredentials): Promise<LoginResponse>
// POST /api/auth/login
// Trả về: { message, accessToken, user }

authService.getProfile(): Promise<User>
// GET /api/users/me (dùng để verify token & lấy user info)

authService.register(payload: RegisterPayload): Promise<RegisterResponse>
// POST /api/auth/register
```

---

### 5. **Tích Hợp API vào SignIn** (`src/pages/auth/SignIn.tsx`)

**Tính năng:**

- ✅ Form validation với Zod:
  - Email: định dạng hợp lệ
  - Password: không được trống
- ✅ React Hook Form + Zod Resolver
  - Hiển thị lỗi validation dưới mỗi field
- ✅ useMutation từ React Query:
  - Gọi `authService.login()`
  - Loading state: Nút Sign In thay đổi thành "Signing In..."
  - OnSuccess:
    - Lưu auth state (`setAuth`)
    - Redirect: `/instructor/courses` (nếu role = instructor) hoặc `/student`
  - OnError: Có thể thêm error notification

**Ví dụ Validation Schema:**

```typescript
const signInSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});
```

---

### 6. **React Query Setup** (`src/main.tsx`)

**Cấu hình:**

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

### 7. **Helper Hook** (`src/hooks/useAuth.ts`)

**Hook tiện lợi:**

```typescript
const { user, token, isAuthenticated, setAuth, logout, recover } = useAuth();
```

---

### 8. **Protected Route Component** (`src/components/ProtectedRoute.tsx`)

**Sử dụng:**

```typescript
<ProtectedRoute requiredRole="instructor">
  <InstructorPage />
</ProtectedRoute>
```

**Tính năng:**

- Kiểm tra user đã đăng nhập
- Kiểm tra role (nếu cần)
- Redirect tới `/login` nếu chưa auth

---

### 9. **App Initializer** (`src/components/AppInitializer.tsx`)

**Tính năng:**

- Tự động khôi phục auth state từ localStorage khi app load
- Giúp người dùng không bị logout sau khi refresh trang

---

## 📁 Cấu Trúc File

```
src/
├── api/
│   └── axiosClient.ts           # Axios config + interceptors
├── stores/
│   └── useAuthStore.ts          # Zustand auth store
├── services/
│   └── auth.service.ts          # Auth API functions
├── hooks/
│   └── useAuth.ts               # Helper hook
├── components/
│   ├── ProtectedRoute.tsx        # Route protection component
│   └── AppInitializer.tsx        # App init component
├── pages/
│   └── auth/
│       └── SignIn.tsx           # Login page (updated)
├── types/
│   └── index.ts                 # TypeScript types
├── App.tsx                       # App routes (updated with AppInitializer)
└── main.tsx                      # React Query provider (updated)
```

---

## 🔐 Luồng Đăng Nhập

```
User nhập email & password
         ↓
Form validation (Zod)
         ↓
Gọi mutation login (authService.login)
         ↓
Request POST /api/auth/login (qua axiosClient)
         ↓
Response: { accessToken, user }
         ↓
Lưu state: setAuth(user, token)
         ↓
Token được lưu vào localStorage
         ↓
Redirect dựa trên role (instructor/student)
         ↓
AppInitializer khôi phục auth khi reload trang
```

---

## 🚀 Cách Sử Dụng

### Đăng Nhập

1. Vào `/login` hoặc `/sign-in`
2. Nhập email & password
3. Hệ thống xác thực & redirect

### Trang Được Bảo Vệ

```typescript
// Ví dụ: InstructorLayout
<ProtectedRoute requiredRole="instructor">
  <Route path="/instructor" element={<InstructorLayout />} />
</ProtectedRoute>
```

### Kiểm Tra User Đăng Nhập

```typescript
const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### Đăng Xuất

```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/login");
};
```

---

## 🧪 Test Accounts (Từ Backend Seed)

```
Admin:
  Email: admin@cinx.local
  Password: password123

Instructor:
  Email: instructor1@cinx.local
  Password: password123

Student:
  Email: student@cinx.local
  Password: password123
```

---

## ⚙️ Environment Variables

**`.env` file:**

```
VITE_API_URL=http://localhost:9090/api
VITE_ACCESS_TOKEN_KEY=accessToken
```

---

## 🔄 Next Steps (Giai Đoạn 2)

- [ ] Triển khai trang SignUp (Register)
- [ ] Thêm Protected Routes cho Instructor & Student pages
- [ ] Triển khai Home page - Course List API
- [ ] Tích hợp Course Detail API
- [ ] Triển khai Shopping Cart API
- [ ] Tích hợp Payment API

---

## 📝 Notes

- Token được lưu ở `localStorage` với key `accessToken`
- Token tự động gắn vào mọi request qua interceptor
- Nếu API trả về 401, token sẽ bị xóa & user chuyển hướng tới login
- Form validation được áp dụng tự động khi user nhập liệu
- Kiểm tra `isAuthenticated` trước khi render protected content

---

**✨ Phase 1 Authentication Complete! Ready for Phase 2.**
