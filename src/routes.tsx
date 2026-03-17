import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import CaseViewer from './pages/CaseViewer';
import StatuteViewer from './pages/StatuteViewer';
import BriefGenerator from './pages/BriefGenerator';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import Library from './pages/Library';
import DocumentAnalysis from './pages/DocumentAnalysis';
import ProcessDrafter from './pages/ProcessDrafter';
import PredictorPage from './pages/PredictorPage';
import DemoPitch from './pages/DemoPitch';
import MarketingStudio from './pages/MarketingStudio';
import LandingPage from './pages/LandingPage';
import AccessDenied from './pages/AccessDenied';
import { useWaitlist } from './hooks/useWaitlist';

export default function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { onWaitlist, loading: waitlistLoading } = useWaitlist(user);

  if (authLoading || (user && waitlistLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#E4E3E0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#141414]"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? (onWaitlist ? <Navigate to="/app" /> : <Navigate to="/denied" />) : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/demo" element={<DemoPitch />} />
      <Route path="/denied" element={user && !onWaitlist ? <AccessDenied /> : <Navigate to="/" />} />
      
      <Route path="/app" element={user && onWaitlist ? <Layout /> : <Navigate to="/" />}>
        <Route index element={<SearchPage />} />
        <Route path="cases/:id" element={<CaseViewer />} />
        <Route path="statutes" element={<StatuteViewer />} />
        <Route path="briefs" element={<BriefGenerator />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="library" element={<Library />} />
        <Route path="analysis" element={<DocumentAnalysis />} />
        <Route path="drafter" element={<ProcessDrafter />} />
        <Route path="predictor" element={<PredictorPage />} />
        <Route path="marketing" element={<MarketingStudio />} />
      </Route>
    </Routes>
  );
}
