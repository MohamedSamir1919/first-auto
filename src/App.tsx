
import HomeLayout from './pages/layout/HomeLayout'
import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Shopping from './pages/Shopping'
import Product from './pages/Product';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Posts from './pages/Posts';
import Post from './pages/Post';
import Adminlayout from './pages/admin/layout/Adminlayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Delivery from './pages/Delivery';
import About from './pages/About';
import Sells from './pages/admin/Sells'
import Users from './pages/admin/Users'
import Orders from './pages/admin/Orders'
import Settings from './pages/admin/Settings'
import Collections from './pages/admin/Collections'
import PostsManager from './pages/admin/PostsManager';

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path='/shopping/:id' element={<Product />} />

            <Route path="/shopping" element={<Shopping />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tracker" element={<Delivery />} />
            <Route path="/about" element={<About />} />
            <Route path="/post" element={<Posts />} />
            <Route path="/post/:id" element={<Post />} />
          </Route>
          <Route path="/admin" element={<Adminlayout />}>
            <Route index element={<Dashboard />} />
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/sells" element={<Sells />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/collections" element={<Collections />} />
            <Route path="/admin/posts" element={<PostsManager />} />

          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
