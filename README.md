# Sentry Academy

A feature adoption engine disguised as a learning platform experience. Sentry Academy strategically guides current Sentry users beyond basic error tracking to discover and implement advanced features, ultimately accelerating their time-to-value and increasing product adoption.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **pnpm** (version 7 or higher) - This project uses pnpm as the package manager

You can install pnpm globally if you don't have it:

```bash
npm install -g pnpm
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sentry_academy
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` to view the application.

## 📜 Available Scripts

- `pnpm dev` - Start the development server with hot reload
- `pnpm build` - Build the project for production
- `pnpm preview` - Preview the production build locally
- `pnpm lint` - Run ESLint to check for code issues

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and autoprefixer
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
sentry_academy/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   └── logos/             # Brand logos
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── LearningPaths.tsx
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── RoleContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/             # Static data and content
│   │   ├── courses.ts
│   │   ├── roles.ts
│   │   └── stats.ts
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── docs/                 # Project documentation
└── commands/             # Development workflow commands
```

## 🎯 Key Features

### Interactive Learning Experience

- **Role-based Learning Paths** - Tailored recommendations for different developer roles
- **Comprehensive Course Library** - À la carte courses covering specific Sentry features
- **Progressive Content Structure** - From basics to advanced implementations

### Content Types

- **Feature Overviews** - Clear explanations of what each Sentry feature does
- **Implementation Guides** - Step-by-step code examples
- **Real-world Scenarios** - Practical use cases and applications
- **Social Proof** - Customer case studies and success stories

### User Experience

- **Dark/Light Mode** - Adaptive theming for user preference
- **Responsive Design** - Optimized for desktop and mobile devices
- **Smooth Animations** - Polished interactions and transitions
- **Fast Performance** - Built with Vite for optimal loading speeds

## 🎨 Styling and Theming

The app uses Tailwind CSS with a custom design system:

- **Adaptive Theming** - Automatic dark/light mode switching
- **Consistent Color Palette** - Sentry brand colors throughout
- **Responsive Grid System** - Mobile-first responsive design
- **Custom Animations** - Smooth transitions and hover effects

## 🔧 Development Guidelines

### Code Style

- Use **functional components** and React hooks
- Prefer **functional programming** patterns over OOP
- Follow **TypeScript best practices** for type safety
- Use **semantic HTML** and accessibility best practices

### Component Structure

- Keep components **small and focused**
- Use **proper prop typing** with TypeScript
- Implement **proper error boundaries** where needed
- Follow **React best practices** for performance

### Package Management

- Always use `pnpm add <package>` when installing new dependencies
- Keep dependencies up to date
- Use exact versions for critical dependencies

## 🚢 Deployment

This project is configured for deployment on **Vercel**:

1. **Build the project**

   ```bash
   pnpm build
   ```

2. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Vercel will automatically detect the Vite configuration
   - The build command is automatically set to `pnpm build`
   - The output directory is set to `dist`

## 📝 Environment Setup

The project doesn't require any environment variables by default. If you need to add configuration:

1. Create a `.env.local` file in the root directory
2. Add your environment variables (prefixed with `VITE_` for client-side access)
3. Update this README with the required variables

Example:

```bash
VITE_API_URL=https://api.example.com
VITE_SENTRY_DSN=your-sentry-dsn
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the development guidelines
4. **Run linting** (`pnpm lint`) to ensure code quality
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 📋 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies out of sync:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build errors:**

```bash
# Clear Vite cache and rebuild
rm -rf dist .vite
pnpm build
```

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

This project is part of the Sentry ecosystem. See the LICENSE file for details.

---

**Happy coding!** 🎉

For questions or support, please reach out to the development team or create an issue in the repository.
