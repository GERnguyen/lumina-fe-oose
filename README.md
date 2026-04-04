# Cinx E-learning Frontend

Frontend web app cho nen tang hoc truc tuyen Lumina (Cinx), ket noi truc tiep voi backend API.
Muc tieu la cung cap trai nghiem hoc tap, ban khoa hoc, va quan tri noi dung theo role.

## Project Overview

Ung dung FE bao gom cac nhom chuc nang:

- Kham pha khoa hoc: home, category, course detail, search/sort/filter.
- Authentication: sign in, sign up, profile, OTP flow.
- Student area: purchase history, learning progress, review course.
- Instructor area: my courses, manage content, enrolled users, settings, reply review.
- Admin area: quan ly users, duyet khoa hoc pending.

## Role-based Experience

- `student`: mua va hoc khoa hoc, xem lich su giao dich, danh gia.
- `instructor`: quan ly khoa hoc, cap nhat noi dung, theo doi hoc vien.
- `admin`: moderation va quan tri tai khoan/he thong.

Route guard va post-login redirect duoc xu ly theo role de tranh truy cap sai khu vuc.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query (React Query)
- Zustand
- Tailwind CSS
- Axios

## Frontend Architecture

- `src/pages`: page-level screens theo domain.
- `src/components`: UI components tai su dung.
- `src/layouts`: layout theo role (student/instructor/admin).
- `src/services`: API client theo resource.
- `src/hooks`: custom hooks va query hooks.
- `src/types`: contract types cho du lieu.

Flow du lieu chinh:

`Page -> Hook/Query -> Service -> Axios -> Backend API`.

## Key Product Flows

### Course discovery

1. User vao trang home, xem category noi bat.
2. Filter/sort danh sach khoa hoc.
3. Vao course detail de xem curriculum va reviews.

### Instructor operations

1. Instructor tao/chinh sua noi dung khoa hoc.
2. Theo doi danh sach hoc vien da enroll.
3. Reply truc tiep vao review cua student trong trang manage course.

### Admin moderation

1. Admin vao dashboard rieng.
2. Xem user theo role.
3. Approve/remove khoa hoc dang pending.

## Environment

Tao file `.env` trong thu muc `fe/`:

```env
VITE_API_URL=http://localhost:9090/api
VITE_ACCESS_TOKEN_KEY=accessToken
```

## Setup and Run

### 1) Install dependencies

```bash
npm install
```

### 2) Start dev server

```bash
npm run dev
```

Mac dinh FE chay o `http://localhost:5173`.

Luu y: backend can chay truoc de FE goi API thanh cong.

## Build and Preview

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev`: chay app o che do development.
- `npm run build`: type-check + bundle production.
- `npm run preview`: preview ban build local.
- `npm run lint`: lint source code.

## Integration Notes

- FE phu thuoc vao API contract cua repo backend (`be`).
- Neu backend doi shape response, can cap nhat layer `services` va `types` tuong ung.
- Cac duong dan auth va role guard la thanh phan quan trong de dam bao dung nghiep vu.
