import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PostItemPage from './pages/PostItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MyPostsPage from './pages/MyPostsPage';
import NotFoundPage from './pages/NotFoundPage';
import MyClaimsPage from './pages/MyClaimsPage';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/post-item" element={
            <ProtectedRoute><PostItemPage /></ProtectedRoute>
          } />
          <Route path="/my-posts" element={
            <ProtectedRoute><MyPostsPage /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/my-claims" element={
            <ProtectedRoute><MyClaimsPage /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;