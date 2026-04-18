import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { LandingPage } from "./app/landing/page";
import { InputPage } from "./app/input/page";
import { DrawPage } from "./app/draw/page";
import { DockPage } from "./app/dock/page";
import { ResultsPage } from "./app/results/[jobId]/page";
import { ReportPage } from "./app/report/[jobId]/page";
import { BatchPage } from "./app/batch/[batchId]/page";
import { DashboardPage } from "./app/dashboard/page";
import { SettingsPage } from "./app/settings/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "input", element: <InputPage /> },
      { path: "draw", element: <DrawPage /> },
      { path: "dock", element: <DockPage /> },
      { path: "results/:jobId", element: <ResultsPage /> },
      { path: "report/:jobId", element: <ReportPage /> },
      { path: "batch/:batchId", element: <BatchPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
