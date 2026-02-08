# Contributing to Task1 Web Application

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start for Contributors

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/task1-webapp.git
   cd task1-webapp
   ```
3. **Follow setup instructions** in `SETUP.md`
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes**
6. **Test thoroughly**
7. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

---

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define interfaces for all data structures
- Avoid `any` type - use proper types or `unknown`
- Use async/await over promises

### Backend (Express)

```typescript
// ✅ Good
export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
};

// ❌ Bad
export const getUser = (req, res) => {
  prisma.user.findUnique({ where: { id: req.userId } }).then(user => {
    res.json(user);
  });
};
```

### Frontend (React)

```tsx
// ✅ Good
interface UserProfileProps {
  userId: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  return <div>{data?.name}</div>;
};

// ❌ Bad
export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  return <div>{user?.name}</div>;
};
```

### Naming Conventions

- **Files:** Use camelCase for files (e.g., `userController.ts`, `PostCard.tsx`)
- **Components:** PascalCase (e.g., `UserProfile`, `PostList`)
- **Functions:** camelCase (e.g., `getUserProfile`, `handleSubmit`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `API_URL`)
- **Interfaces/Types:** PascalCase with `I` prefix (e.g., `IUser`, `IPost`)

---

## 🏗️ Project Structure

### Adding New Features

#### Backend: Add New API Endpoint

1. **Create controller** in `backend/src/controllers/`
   ```typescript
   // backend/src/controllers/commentController.ts
   export const createComment = async (req: AuthRequest, res: Response) => {
     // Implementation
   };
   ```

2. **Add validation** using express-validator
   ```typescript
   const createCommentValidation = [
     body('content').trim().notEmpty(),
     body('postId').isInt(),
   ];
   ```

3. **Create route** in `backend/src/routes/`
   ```typescript
   // backend/src/routes/comments.ts
   import { createComment } from '../controllers/commentController';
   router.post('/', authenticate, createCommentValidation, createComment);
   ```

4. **Register route** in `backend/src/server.ts`
   ```typescript
   app.use('/api/comments', commentRoutes);
   ```

5. **Update Prisma schema** if needed
   ```prisma
   model Comment {
     id        Int      @id @default(autoincrement())
     content   String
     postId    Int
     post      Post     @relation(fields: [postId], references: [id])
     createdAt DateTime @default(now())
   }
   ```

6. **Run migration**
   ```bash
   npx prisma migrate dev --name add_comments
   ```

#### Frontend: Add New Page

1. **Create page** in `app/` directory
   ```tsx
   // app/(dashboard)/dashboard/comments/page.tsx
   export default function CommentsPage() {
     return <div>Comments</div>;
   }
   ```

2. **Add navigation link** in layout
   ```tsx
   <Link href="/dashboard/comments">Comments</Link>
   ```

3. **Create service** in `lib/`
   ```typescript
   // lib/comments.ts
   export const commentService = {
     async getComments() {
       const response = await api.get('/comments');
       return response.data.data;
     },
   };
   ```

4. **Use TanStack Query** for data fetching
   ```tsx
   const { data, isLoading } = useQuery({
     queryKey: ['comments'],
     queryFn: () => commentService.getComments(),
   });
   ```

---

## 🧪 Testing

### Backend Tests (Future)

When adding backend tests:

```typescript
import request from 'supertest';
import app from '../src/server';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### Frontend Tests (Future)

```tsx
import { render, screen } from '@testing-library/react';
import { LoginPage } from './page';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

---

## 📚 Documentation

### When to Update Documentation

- Adding new API endpoints → Update `backend/README.md` and `API_REFERENCE.md`
- Adding new features → Update `README.md`
- Changing setup process → Update `SETUP.md`
- Adding deployment options → Update `DEPLOYMENT.md`
- Performance improvements → Update `SCALING.md`

### Documentation Style

- Use clear, concise language
- Include code examples
- Add "Why" explanations for complex decisions
- Keep line length under 100 characters
- Use proper markdown formatting

---

## 🐛 Bug Reports

### Before Reporting

1. Search existing issues
2. Check if it's already fixed in latest version
3. Verify it's not a configuration issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

**Additional context**
Any other context about the problem.
```

---

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or references.
```

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] Documentation updated
- [ ] No console.log statements left
- [ ] No commented-out code
- [ ] Environment variables documented

### PR Title Format

- `Add: New feature description`
- `Fix: Bug description`
- `Update: What was updated`
- `Refactor: What was refactored`
- `Docs: Documentation changes`

### PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

---

## 🔐 Security

### Reporting Security Issues

**DO NOT** open a public issue for security vulnerabilities.

Instead:
1. Email details to [security contact]
2. Include detailed description
3. Include steps to reproduce
4. We'll respond within 48 hours

### Security Best Practices

- Never commit secrets or API keys
- Use environment variables
- Validate all user input
- Use parameterized queries (Prisma handles this)
- Keep dependencies updated
- Follow OWASP guidelines

---

## 🎨 UI/UX Contributions

### Design Changes

- Maintain consistent color scheme
- Ensure responsive design (mobile/tablet/desktop)
- Follow accessibility guidelines (WCAG 2.1)
- Test on multiple browsers
- Add loading states and error handling

### Adding New Components

```tsx
// components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

---

## 📦 Dependencies

### Adding New Dependencies

1. **Check necessity:** Can it be done without a new dependency?
2. **Check bundle size:** Will it significantly increase bundle size?
3. **Check maintenance:** Is it actively maintained?
4. **Check license:** Is it compatible with MIT?
5. **Document:** Explain why it's needed in PR

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages (carefully)
npm update

# Test thoroughly after updates
```

---

## 🌐 Internationalization (Future)

If adding i18n support:

1. Use `next-intl` or `react-i18next`
2. Extract all text strings
3. Create translation files
4. Document translation process

---

## ♿ Accessibility

### Checklist

- [ ] Semantic HTML elements
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on images
- [ ] Form labels associated with inputs
- [ ] Error messages are clear

### Testing

- Test with screen reader (NVDA, JAWS, VoiceOver)
- Test keyboard-only navigation
- Test with browser zoom at 200%

---

## 📊 Performance

### Backend Performance

- Use database indexes
- Implement caching where appropriate
- Paginate large result sets
- Use select to limit returned fields
- Profile slow queries

### Frontend Performance

- Code split large components
- Lazy load images
- Minimize bundle size
- Use React.memo for expensive components
- Optimize re-renders with proper dependencies

---

## 📖 Learning Resources

### For Backend

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### For Frontend

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query)

---

## 🤝 Community

### Be Respectful

- Be kind and constructive
- Assume good intentions
- Provide helpful feedback
- Respect different opinions
- Welcome newcomers

### Getting Help

1. Check existing documentation
2. Search closed issues
3. Ask in discussions (if available)
4. Open an issue with details

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Thank you for contributing to making this project better!

Every contribution, no matter how small, is valued and appreciated.

---

## Contact

For questions about contributing:
- Open a discussion
- Email: [contact email]
- Create an issue

**Happy Coding! 🚀**
