import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import userAtom from './atoms/userAtom';
import UpdateProfile from './pages/UpdateProfile';
import CreatePost from './components/CreatePost';
import ChatPage from './pages/ChatPage';
import Suggetion from './pages/Suggetion';

function App() {
  const user = useRecoilState(userAtom);
  
  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4 w-full h-screen">
        <Header />
        <Routes>
          <Route path="/" element={user[0] !== null ? <HomePage /> : <Navigate to="/auth" />}/>
          <Route path="/auth" element={user[0] == null ? <AuthPage /> : <Navigate to="/" />}/>
          <Route path="/update" element={user[0] !== null ? <UpdateProfile /> : <Navigate to="/auth" />}/>
          <Route path="/:username" element={<UserPage />}/>
          <Route path="/:username/post/:pid" element={<PostPage />}/>
          <Route path="/newpost" element={<CreatePost />}/>
          <Route path="/chat" element={user[0] !== null ? <ChatPage /> : <Navigate to="/auth" />}/>
          <Route path="/getsuggetion" element={<Suggetion />}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
