
import './App.css';
import { Router, Routes, Route } from 'react-router-dom';
import Login from './component/log-in/Login.js';
import Index from './component/index/Index.js';
import Sign from './component/sign-up/Sign.js';
import Profile from './component/profile/Profile.js';
import Message from './component/MessagePage/Message.js';
import Main from './component/main/Main.js';
import Auth from './component/auth/Auth.js';
import CreatePost from './component/createPost/Creat-Post.js';
import CreateStroy from './component/createStory/CreateStroy.js';
import Discover from './component/discover/discover.js';
import EditProfile from './component/editProfile/EditProfile.js';


function App() {
  return (

    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/log-in" element={<Login />} />
      <Route path='/sign-up' element={<Sign />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/Message' element={<Message />} />
      <Route path='/Main' element={<Auth><Main /></Auth>} />
      <Route path='/createPost' element={<Auth><CreatePost /></Auth>} />
      <Route path='/createStory' element={<CreateStroy />} />
      <Route path='/discover' element={<Discover />} />
      <Route path='/editProfile' element={<EditProfile />} />
      {/* <Route path='/reel' element={<Reel />} /> */}
    </Routes>

  );
}
export default App;
