# Frontend - Task1 Web Application

Modern, responsive web application built with Next.js 15, React, TypeScript, and TailwindCSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Context API + TanStack Query
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Data Fetching:** TanStack Query (React Query)

## Features

✅ JWT-based authentication  
✅ Protected routes with middleware  
✅ Responsive design (mobile, tablet, desktop)  
✅ Form validation (client-side + server-side)  
✅ Real-time search and filtering  
✅ Pagination support  
✅ Loading states and error handling  
✅ Optimistic updates  
✅ SEO-friendly with meta tags  

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/                   # Auth pages group
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Register page
│   ├── (dashboard)/              # Dashboard group (protected)
│   │   └── dashboard/
│   │       ├── layout.tsx       # Dashboard layout with sidebar
│   │       ├── page.tsx         # Dashboard home
│   │       ├── posts/
│   │       │   ├── page.tsx     # Posts list
│   │       │   ├── new/
│   │       │   │   └── page.tsx # Create post
│   │       │   └── [id]/
│   │       │       ├── page.tsx # View post
│   │       │       └── edit/
│   │       │           └── page.tsx # Edit post
│   │       └── profile/
│   │           └── page.tsx     # User profile
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable components (future)
├── lib/
│   ├── api.ts                    # Axios client with interceptors
│   ├── auth.ts                   # Auth service functions
│   ├── posts.ts                  # Posts service functions
│   └── types.ts                  # TypeScript interfaces
├── providers/
│   ├── AuthProvider.tsx          # Auth context provider
│   └── QueryProvider.tsx         # React Query provider
├── middleware.ts                 # Route protection middleware
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Pages Overview

### Public Pages

#### Home Page (`/`)
- Landing page with app overview
- Links to login and register
- Feature highlights

#### Login Page (`/login`)
- Email and password form
- Form validation with Zod
- Error handling
- Redirect to dashboard on success

#### Register Page (`/register`)
- Name, email, password, confirm password
- Client-side validation
- Password strength requirements (min 8 chars)
- Redirect to dashboard on success

### Protected Pages (Requires Authentication)

#### Dashboard Home (`/dashboard`)
- Welcome message
- User profile summary
- Quick action buttons
- Getting started guide

#### Posts List (`/dashboard/posts`)
- View all posts with pagination
- Search functionality (searches title, content, excerpt)
- Filter by status (all/published/draft)
- Edit, view, delete actions
- Empty state for no posts

#### Create Post (`/dashboard/posts/new`)
- Form with title, excerpt, content, status
- Rich validation rules
- Draft or publish immediately
- Redirect to posts list on success

#### View Post (`/dashboard/posts/[id]`)
- Display full post content
- Author and date information
- Status badge
- Edit button

#### Edit Post (`/dashboard/posts/[id]/edit`)
- Pre-filled form with existing data
- Save changes
- Optimistic UI updates
- Redirect to post view on success

#### Profile Page (`/dashboard/profile`)
- Edit user name and email
- View account information
- Success/error feedback

## Authentication Flow

1. User visits protected route (e.g., `/dashboard`)
2. `middleware.ts` checks for authentication
3. If not authenticated, redirect to `/login`
4. User logs in, JWT token stored in localStorage
5. Token included in all API requests via Axios interceptor
6. On 401 error, user redirected to login

## State Management

### Auth State (Context API)
```tsx
const { user, loading, error, login, register, logout, refreshProfile } = useAuth();
```

### Server State (TanStack Query)
```tsx
// Fetching posts with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['posts', page, search, status],
  queryFn: () => postService.getPosts({ page, search, status }),
});

// Creating a post with optimistic updates
const mutation = useMutation({
  mutationFn: (data) => postService.createPost(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

## Form Validation

Using React Hook Form + Zod for type-safe validation:

```tsx
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## API Integration

### Axios Setup
```typescript
// Automatic token injection
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic logout on 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Styling with TailwindCSS

### Custom Utility Classes

Defined in `globals.css`:

```css
/* Buttons */
.btn-primary { /* Primary button styles */ }
.btn-secondary { /* Secondary button styles */ }

/* Forms */
.input-field { /* Form input styles */ }

/* Cards */
.card { /* Card container styles */ }
```

### Responsive Design

All pages are fully responsive:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## Performance Optimizations

### 1. Code Splitting
- Automatic route-based code splitting by Next.js
- Dynamic imports for heavy components

### 2. Image Optimization
- Use Next.js `<Image>` component for optimized images
- Automatic WebP conversion and lazy loading

### 3. Data Caching
- TanStack Query caches API responses for 5 minutes
- Reduces unnecessary API calls
- Optimistic UI updates for better UX

### 4. Prefetching
- Next.js automatically prefetches linked pages
- Instant navigation between routes

## Running the Frontend

### Development
```bash
npm run dev
```
Opens at http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create `.env.local` in frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Protected Routes

Routes matching `/dashboard/*` are protected by middleware:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check authentication
    // Redirect to login if not authenticated
  }
}
```

## Error Handling

### API Errors
```tsx
try {
  await login(data);
} catch (err: any) {
  const message = err.response?.data?.error || 'Login failed';
  setError(message);
}
```

### Error Boundaries
Future enhancement: Add React Error Boundaries for graceful error handling

## Custom Hooks

### `useAuth`
```tsx
const { user, loading, login, logout } = useAuth();
```

Provides:
- `user`: Current authenticated user
- `loading`: Loading state
- `error`: Error message
- `login(data)`: Login function
- `register(data)`: Register function
- `logout()`: Logout function
- `refreshProfile()`: Refresh user data

## Keyboard Shortcuts

- `Enter`: Submit forms
- `Esc`: Close modals (future)
- `Ctrl+K`: Search (future)

## Accessibility

✅ Semantic HTML elements  
✅ ARIA labels on interactive elements  
✅ Keyboard navigation support  
✅ Focus states on all interactive elements  
✅ Color contrast compliance  

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Issues

### "Cannot connect to backend"
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### "Token expired"
- Login again to get a new token
- JWT tokens expire after 1 hour

### Styles not updating
- Clear Next.js cache: `rm -rf .next`
- Restart dev server

### TypeScript errors
- Restart TypeScript server in VS Code
- Run `npm run build` to catch type errors

## Future Enhancements

- [ ] Dark mode support
- [ ] i18n (internationalization)
- [ ] Rich text editor for posts (e.g., Tiptap)
- [ ] Image upload support
- [ ] Markdown preview
- [ ] Social sharing buttons
- [ ] Comments section
- [ ] User avatars
- [ ] Notifications system
- [ ] Progressive Web App (PWA)

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- Cloudflare Pages
- Railway

## SEO Optimization

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Task1 - Web App',
  description: 'Scalable web application with authentication',
};
```

## Testing (Future)

- [ ] Unit tests with Jest
- [ ] Integration tests with Testing Library
- [ ] E2E tests with Playwright
- [ ] Visual regression tests

## License

MIT
