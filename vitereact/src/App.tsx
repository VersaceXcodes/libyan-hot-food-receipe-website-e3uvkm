import React from "react";
import { Route, Routes } from "react-router-dom";

/* Import global shared views */
import GV_TopNav from '@/components/views/GV_TopNav.tsx';
import GV_Footer from '@/components/views/GV_Footer.tsx';
import GV_SearchBar from '@/components/views/GV_SearchBar.tsx';
import GV_AdminNav from '@/components/views/GV_AdminNav.tsx';
import GV_AdminFooter from '@/components/views/GV_AdminFooter.tsx';

/* Import unique views */
import UV_Landing from '@/components/views/UV_Landing.tsx';
import UV_RecipeListing from '@/components/views/UV_RecipeListing.tsx';
import UV_RecipeDetail from '@/components/views/UV_RecipeDetail.tsx';
import UV_About from '@/components/views/UV_About.tsx';
import UV_Contact from '@/components/views/UV_Contact.tsx';
import UV_AdminLogin from '@/components/views/UV_AdminLogin.tsx';
import UV_AdminDashboard from '@/components/views/UV_AdminDashboard.tsx';
import UV_AdminRecipeEditor from '@/components/views/UV_AdminRecipeEditor.tsx';

interface PublicLayoutProps {
  showSearch: boolean;
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ showSearch, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <GV_TopNav />
      {showSearch && <GV_SearchBar />}
      <main className="flex-grow">
        {children}
      </main>
      <GV_Footer />
    </div>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <GV_AdminNav />
      <main className="flex-grow">
        {children}
      </main>
      <GV_AdminFooter />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes using PublicLayout */}
        <Route
          path="/"
          element={
            <PublicLayout showSearch={true}>
              <UV_Landing />
            </PublicLayout>
          }
        />
        <Route
          path="/recipes"
          element={
            <PublicLayout showSearch={true}>
              <UV_RecipeListing />
            </PublicLayout>
          }
        />
        <Route
          path="/recipes/:recipe_id"
          element={
            <PublicLayout showSearch={false}>
              <UV_RecipeDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout showSearch={false}>
              <UV_About />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout showSearch={false}>
              <UV_Contact />
            </PublicLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<UV_AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <UV_AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/recipes/new"
          element={
            <AdminLayout>
              <UV_AdminRecipeEditor />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/recipes/:recipe_id"
          element={
            <AdminLayout>
              <UV_AdminRecipeEditor />
            </AdminLayout>
          }
        />
      </Routes>
    </>
  );
};

export default App;