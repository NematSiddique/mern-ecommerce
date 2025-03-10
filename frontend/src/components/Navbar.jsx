import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header 
      className="fixed top-0 left-0 w-full bg-gray-950 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-yellow-500/95"
    >
      <div 
        className="container mx-auto px-4 py-4"
      >
        <div className="flex flex-wrap justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-yellow-500/95 items-center space-x-2 flex"
          >
            E-Commerce
          </Link>

          <nav 
            className="flex flex-wrap items-center gap-4"
          >
            <Link 
              to={"/"} 
              className="text-gray-200 hover:text-yellow-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user && (
              <Link 
                to={"/cart"} 
                className="relative group text-gray-200 hover:text-yellow-400 transition duration-300 ease-in-out"
              >
                <ShoppingCart className="inline-block mr-1 group-hover:text-yellow-400" size={20} />
                <span className="hidden sm:inline">
                Cart
                </span>
                {cart.length > 0 && (
                  <span  
                  className="absolute -top-2 -left-2 bg-yellow-500/95 text-black rounded-full px-2 py-0.5 text-xs group-hover:bg-yellow-400 transition duration-300 ease-in-out"
                  >
                  {cart.length}
                </span>
              )}
              </Link>
            )}
          
            {isAdmin && (
              <Link 
                className="bg-yellow-500/95 hover:bg-yellow-400 text-black px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button 
                className="bg-gray-900 hover:bg-gray-800 border border-yellow-500/95 text-white px-4 py-1 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50 transition duration-300 ease-in-out"
                onClick={logout}>
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link 
                  to={"/signup"} 
                  className="bg-yellow-500/90 hover:bg-yellow-400 text-black font-medium px-4 py-1 rounded-md flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
              
                <Link 
                  to={"/login"} 
                  className="bg-gray-900 hover:bg-gray-800 border border-yellow-500/95 text-white px-4 py-1 rounded-md flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
        
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;