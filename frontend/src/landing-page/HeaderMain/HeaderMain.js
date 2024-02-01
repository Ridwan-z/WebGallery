import Kategori from '../Kategori/Kategori';
import Comment from '../Comment/Comment';
import Profile from '../Profile/Profile';
import Topbar from '../Topbar/Topbar';
import './HeaderMain.css';
import { Route, Routes } from 'react-router-dom';
import ProfileUser from '../ProfileUser/ProfileUser';
const HeaderMain = () => {
  return (
    <div className='h_main'>
    <Topbar/>
    <Routes>
      <Route index element={<Kategori/>} />
      <Route path="comment-gambar/:id" element={<Comment/>} />
      <Route path="profile/:id" element={<Profile/>} />
      <Route path="profile-user" element={<ProfileUser/>} />
      </Routes>
    </div>
  )
}

export default HeaderMain