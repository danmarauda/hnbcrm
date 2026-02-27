import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getQueryClientSingleton,
  getConvexQueryClientSingleton,
} from "better-convex/react";
import { CRPCProvider } from "./lib/crpc";
import { authClient } from "./lib/auth-client";
import { Toaster } from "sonner";
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { AuthLayout } from "./components/layout/AuthLayout";
import { DevelopersPage } from "./pages/DevelopersPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { Spinner } from "./components/ui/Spinner";

// Lazy load authenticated routes
const DashboardOverview = lazy(() => import("./components/DashboardOverview").then(m => ({ default: m.DashboardOverview })));
const KanbanBoard = lazy(() => import("./components/KanbanBoard").then(m => ({ default: m.KanbanBoard })));
const ContactsPage = lazy(() => import("./components/ContactsPage").then(m => ({ default: m.ContactsPage })));
const Inbox = lazy(() => import("./components/Inbox").then(m => ({ default: m.Inbox })));
const HandoffQueue = lazy(() => import("./components/HandoffQueue").then(m => ({ default: m.HandoffQueue })));
const TasksPage = lazy(() => import("./components/TasksPage").then(m => ({ default: m.TasksPage })));
const CalendarPage = lazy(() => import("./components/calendar/CalendarPage").then(m => ({ default: m.CalendarPage })));
const TeamPage = lazy(() => import("./components/TeamPage").then(m => ({ default: m.TeamPage })));
const AuditLogs = lazy(() => import("./components/AuditLogs").then(m => ({ default: m.AuditLogs })));
const Settings = lazy(() => import("./components/Settings").then(m => ({ default: m.Settings })));

// Wrapper component for Suspense boundaries
function LazyRoute({ Component }: { Component: React.LazyExoticComponent<() => React.JSX.Element> }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>}>
      <Component />
    </Suspense>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });
}

function QueryAndCRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClientSingleton(createQueryClient);
  const convexQueryClient = getConvexQueryClientSingleton({ convex, queryClient });
  return (
    <QueryClientProvider client={queryClient}>
      <CRPCProvider convexClient={convex} convexQueryClient={convexQueryClient}>
        {children}
      </CRPCProvider>
    </QueryClientProvider>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/developers", element: <DevelopersPage /> },
  { path: "/developers/playground", element: <PlaygroundPage /> },
  { path: "/sign-in", element: <AuthPage /> },
  {
    path: "/app",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <LazyRoute Component={DashboardOverview} /> },
      { path: "pipeline", element: <LazyRoute Component={KanbanBoard} /> },
      { path: "contacts", element: <LazyRoute Component={ContactsPage} /> },
      { path: "inbox", element: <LazyRoute Component={Inbox} /> },
      { path: "tasks", element: <LazyRoute Component={TasksPage} /> },
      { path: "calendar", element: <LazyRoute Component={CalendarPage} /> },
      { path: "handoffs", element: <LazyRoute Component={HandoffQueue} /> },
      { path: "team", element: <LazyRoute Component={TeamPage} /> },
      { path: "audit", element: <LazyRoute Component={AuditLogs} /> },
      { path: "settings", element: <LazyRoute Component={Settings} /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <QueryAndCRPCProvider>
        <RouterProvider router={router} />
        <Toaster theme="dark" />
      </QueryAndCRPCProvider>
    </ConvexBetterAuthProvider>
  </HelmetProvider>,
);
