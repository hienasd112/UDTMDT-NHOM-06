import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Phone, MapPin, LogOut, ListOrdered, Settings } from "lucide-react"; 
import { useCart } from "../hooks/useCart"; 
import { useAuth } from "../hooks/useAuth"; 

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth(); 
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false); 
  const navigate = useNavigate();

  // --- HÀM XỬ LÝ ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`);
      setKeyword("");
      setIsOpen(false);
    } else {
      navigate("/products");
    }
  };

  const closeMobileMenu = () => setIsOpen(false);


  const getShortName = (user) => {
    const fullName = user?.fullName || user?.name || user?.username;
    if (!fullName) return "Tài khoản";
    return fullName.split(' ')[0]; 
  }

  const displayName = user?.fullName || user?.name || user?.username || "Tài khoản";

  return (

    <header className="sticky top-0 z-50 w-full bg-white shadow-md font-sans">
      
      <div className="bg-emerald-900 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1 hover:text-emerald-200 cursor-default">
              <Phone size={14} /> Hotline: <span className="font-bold text-amber-400">0364389055</span>
            </span>
            <span className="flex items-center gap-1 hover:text-emerald-200 cursor-default">
              <MapPin size={14} />87 Bùi Quang Là, Gò Vấp, TP.HCM
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-emerald-200 transition">Liên hệ</Link>
            <span className="text-gray-500">|</span>
            <Link to="/policy/warranty" className="hover:text-emerald-200 transition">Tra cứu bảo hành</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tighter" onClick={closeMobileMenu}>
            Watch<span className="text-gray-800">Store</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 lg:gap-6 font-semibold text-gray-700">
            <NavLinkStyled to="/">Trang chủ</NavLinkStyled>
            <NavLinkStyled to="/products?brand=Seiko">Seiko</NavLinkStyled>
            <NavLinkStyled to="/products?brand=Tissot">Tissot</NavLinkStyled>
            <NavLinkStyled to="/products?brand=G-Shock">G-Shock</NavLinkStyled>
            <NavLinkStyled to="/products">Tất cả</NavLinkStyled>
            {user && user.role === 'admin' && (
                <NavLinkStyled to="/admin/products" className="flex items-center gap-1 text-purple-600">
                    <Settings size={16}/> Admin
                </NavLinkStyled>
            )}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-gray-50">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent outline-none text-sm w-40"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" aria-label="Tìm kiếm" className="text-gray-500 hover:text-emerald-600">
                <Search size={18} />
              </button>
            </form>

            <Link to="/cart" className="relative text-gray-700 hover:text-emerald-600 transition p-1">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-1 ring-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group hidden md:block">
                <button 
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  title={displayName}
                >
                  <User size={18} className="text-emerald-700"/>
                  <span>{getShortName(user)}</span>
                </button>
                <div className="absolute right-0 top-full w-48 hidden group-hover:block bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 transition-all duration-200">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-700">
                        <User size={16}/> Hồ sơ cá nhân
                    </Link>
                    <Link to="/my-orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-700">
                        <ListOrdered size={16}/> Đơn hàng của tôi
                    </Link>
                    {user.role === 'admin' && (
                        <Link to="/admin/products" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
                            <Settings size={16}/> Trang quản trị
                        </Link>
                    )}
                    <hr className="my-1 border-gray-100"/>
                    <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-md whitespace-nowrap hidden md:block">
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-700 hover:text-emerald-600 p-1">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU (Dropdown - Style Code Mới, Links Code Cũ, Đã xóa Automatic) --- */}
        {isOpen && (
          <div className="lg:hidden absolute left-0 top-full w-full bg-white shadow-lg z-40 border-t border-gray-100 max-h-[calc(100vh-65px)] overflow-y-auto">
             <div className="flex flex-col space-y-1 p-4">
              
              {/* Form tìm kiếm Mobile (Style Code Mới) */}
              <form onSubmit={handleSearchSubmit} className="mb-3 flex"> 
                <input 
                  type="text" 
                  value={keyword} 
                  onChange={(e) => setKeyword(e.target.value)} 
                  placeholder="Tìm kiếm sản phẩm..." 
                  className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                /> 
                <button type="submit" aria-label="Tìm kiếm" className="rounded-r-md border border-l-0 border-gray-300 bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"> 
                  <Search size={18} /> 
                </button> 
              </form>
              
              {/* Navigation Links */}
              <MobileNavLink to="/" onClick={closeMobileMenu}>Trang chủ</MobileNavLink>
              <MobileNavLink to="/products?brand=Seiko" onClick={closeMobileMenu}>Seiko</MobileNavLink>
              <MobileNavLink to="/products?brand=Tissot" onClick={closeMobileMenu}>Tissot</MobileNavLink>
              <MobileNavLink to="/products?brand=G-Shock" onClick={closeMobileMenu}>G-Shock</MobileNavLink>
              <MobileNavLink to="/products" onClick={closeMobileMenu}>Tất cả sản phẩm</MobileNavLink>
              
              <hr className="my-2 border-gray-100" />
              
              {/* Auth Links Mobile */}
              {user ? (
                <>
                  <MobileNavLink to="/profile" onClick={closeMobileMenu}> <User size={18} /> Tài khoản ({getShortName(user)}) </MobileNavLink>
                  <MobileNavLink to="/my-orders" onClick={closeMobileMenu}> <ListOrdered size={18} /> Đơn hàng của tôi </MobileNavLink>
                  {user.role === 'admin' && (
                    <MobileNavLink to="/admin/products" onClick={closeMobileMenu} className="text-purple-600"> <Settings size={18}/> Trang Admin </MobileNavLink>
                  )}
                  <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full rounded px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"> 
                    <LogOut size={18}/> Đăng xuất 
                  </button>
                </>
              ) : (
                <Link to="/login" className="block rounded bg-emerald-600 px-3 py-2 text-center text-white font-medium hover:bg-emerald-700 mt-2" onClick={closeMobileMenu}> 
                  Đăng nhập / Đăng ký 
                </Link>
              )}
              <hr className="my-2 border-gray-100" />
              <div className="flex items-center gap-2 text-emerald-700 py-1 text-sm font-medium">
                  <Phone size={16} /> Hotline: 1800 6666
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLinkStyled = ({ to, children, className = '' }) => (
  <Link to={to} className={`text-sm lg:text-base text-gray-600 hover:text-emerald-700 transition font-medium ${className}`} >
    {children}
  </Link>
);
const MobileNavLink = ({ to, onClick, children, className = '' }) => (
   <Link to={to} onClick={onClick} className={`flex items-center gap-2 rounded px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-emerald-700 font-medium ${className}`} >
     {children}
   </Link>
);

export default Navbar;