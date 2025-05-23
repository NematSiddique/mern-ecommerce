import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
	const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if ( !user ) {
      toast.error("Please login to add products to the cart", { id: "login" }); // id to handle spamming (one at a time)
      return;
    } else {
      // add to cart
			addToCart(product);
    }
  };
  
  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-600 shadow-2xl">
      
      <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.image} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
			</div>

      <div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-yellow-400/90'>${product.price}</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-yellow-500/90 px-5 py-2 text-center text-sm font-semibold
					text-gray-800 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-150 ease-in-out disabled:opacity-50'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to cart
				</button>
			</div>

    </div>
  );
};

export default ProductCard