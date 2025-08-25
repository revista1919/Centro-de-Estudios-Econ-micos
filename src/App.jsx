import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import SchoolPage from './pages/SchoolPage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import BiographyDetailPage from './pages/BiographyDetailPage.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage.jsx';
import CourseList from './components/CourseList.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:school" element={<SchoolPage />} />
            <Route path="/:school/articles/:title" element={<ArticleDetailPage />} />
            <Route path="/:school/courses" element={<CourseList />} />
            <Route path="/:school/courses/:course" element={<CourseDetailPage />} />
            <Route path="/:school/biographies/:author" element={<BiographyDetailPage />} />
            <Route path="/:school/books/:title" element={<BookDetailPage />} />
            <Route path="/:school/scholarships/:name" element={<ScholarshipDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;