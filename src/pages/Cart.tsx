import React,{useState,useEffect} from 'react'
import Cookies from 'js-cookie';
import {useNavigate, NavLink} from 'react-router'
import axios from 'axios'
type Props = {}



interface ICartItem {
    _id: string; // Product's main ID
    title: string;
    slug: string; // Product's slug string or ID, used for ordering (from product object)
    img: string;
    price: number; // Original price per unit
    discount?: number; // Discount per unit
    chosenDetails: any;
    quantity: number;
    description?: string; // For display
}

const Cart = (props: Props) => {
    const navigate = useNavigate();
    const token = Cookies.get('token')
    const [cart, setCart] = useState([]);
    const [chosenDetails,setChosenDetails] = useState([])
    const [invoices,setInvoices] = useState([]);
  const getInvoice = async()=>{
    if(JSON.parse(localStorage.getItem("cart") ).length > 0){

      setCart(JSON.parse(localStorage.getItem("cart") ))
    }
    const myInvoiceRes = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/my-invoice`,{},{headers:
      {Authorization:`Bearer ${token}`}
  })
  if(myInvoiceRes.status == 200){
    setInvoices(myInvoiceRes.data.filter((i)=> (i.status !== "canceled" && i.status != "completed")))
  }
  }
    useEffect(()=>{
        // cart?.forEach((c)=>{
        //     for (const [key, value] of Object.entries(c.chosenDetails)) {
        //     setChosenDetails(prev=>[...prev.filter((pr)=>pr.item != c._id),{...chosenDetails.filter((ch)=>{ch.item==c._id})[0],item:c._id,[key]:value}])
        // }
        // })
        const detailsMap = {};

  // Initialize with existing state to preserve other items
  chosenDetails.forEach(item => {
    detailsMap[item.item] = item;
  });

  // 2. Process the cart to merge details
  cart?.forEach((c) => {
    // If the item doesn't exist in our map yet, initialize it
    if (!detailsMap[c._id]) {
      detailsMap[c._id] = { item: c._id };
    }

    // Merge all chosenDetails keys into the single object for this ID
    // This ensures [key]: value stays in the SAME object
    detailsMap[c._id] = {
      ...detailsMap[c._id],
      ...c.chosenDetails
    };
  });

  // 3. Update state ONCE with the combined array
  setChosenDetails(Object.values(detailsMap));


    },[cart])
    // useEffect(()=>{console.log(chosenDetails)},[chosenDetails])
    const SHIPPING_FEE = 50;

    useEffect(()=>{
        const storedCart = localStorage.getItem("cart");
        setCart(storedCart ? JSON.parse(storedCart) : []);
    },[])
   
    const delItem = (itemIndex: number) => {
        const updatedCart = cart.filter((_, index) => index !== itemIndex);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart); // Update state directly
    }
    const checkOut = async()=>{

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const totalAmountBeforeDiscount = cart.reduce((total, curr) => {
            return total + (curr.price * curr.quantity);
        }, 0);
        const totalDiscountAmount = cart.reduce((total, curr) => {
            return total + ((curr.discount || 0) * curr.quantity);
        }, 0);
        const finalPriceForInvoice = totalAmountBeforeDiscount - totalDiscountAmount;

        const status = "order placed"

        try {
            const invoiceRes = await axios.post(`${import.meta.env.VITE_SERVER}/invoice`,
                { price: finalPriceForInvoice, discount: totalDiscountAmount, status: status, paid: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (invoiceRes.status === 200) {
                const invoiceId = invoiceRes.data._id;
                
                const orderPromises = cart.map(item => {
                    const itemNetPrice = (item.price * item.quantity) - ((item.discount || 0) * item.quantity);
                    const itemTotalDiscount = (item.discount || 0) * item.quantity;
                    return axios.post(`${import.meta.env.VITE_SERVER}/order/make-order`, {
                        productId: item._id, // Send product's main ID
                        slug: item.slug,     // Send slug if backend uses it for linking
                        invoice: invoiceId,
                        quantity: item.quantity,
                        price: itemNetPrice, // Net price for this order line
                        discount: itemTotalDiscount,
                        details: item.chosenDetails || []
                    }, { headers: { Authorization: `Bearer ${token}` } });
                });

                const orderResponses = await Promise.all(orderPromises);
                const allOrdersSuccessful = orderResponses.every(res => res.status === 200);

                if (allOrdersSuccessful) {
                    localStorage.removeItem("cart");
                    setCart([]);
                    getInvoice();
                    navigate("/tracker");
                } else {
                    console.error("Some orders could not be placed.", orderResponses);
                    alert("There was an issue placing some of your orders. Please contact support or review your cart.");
                    // Potentially, you might want to revert the invoice or handle partial orders.
                }
            } else {
                console.error("Failed to create invoice", invoiceRes);
                alert("Failed to create your invoice. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout. Please try again.");
        }
    }

    const subTotal = cart.reduce((total, curr) => {
        return total + (curr.price - (curr.discount || 0)) * curr.quantity;
    }, 0);

    const grandTotal = subTotal + (cart.length > 0 ? SHIPPING_FEE : 0);

  return (
    <div className="w-full bg-gray-50 min-h-screen flex flex-col items-center p-4 md:p-8 mt-[60px]">
        <div className="w-full max-w-6xl">
            <h1 className="text-3xl font-bold text-center mb-8">
                {cart.length > 0 ? "Your Shopping Cart" : "Your Cart is Empty"}
            </h1>

            {cart.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:w-2/3 space-y-4">
                        {cart.map((item, index) => {
                            const itemLineTotal = (item.price - (item.discount || 0)) * item.quantity;
                            return (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <NavLink to={`/shopping/${item._id}`} end className="flex-shrink-0">
                                        <img src={`/${item.img}`} alt={item.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border" />
                                    </NavLink>
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-semibold">{item.title}</h2>
                                        {item.description && <p className="text-sm text-gray-600 hidden md:block">{item.description}</p>}
                                       
                                        {chosenDetails && chosenDetails.filter((i)=>i.item == item._id).length > 0 && (
                                            <div className="mt-1 text-sm text-gray-700">
                                                {
                                                
                                              
                                                Object.entries(chosenDetails?.filter((i)=>i.item == item._id)[0])
                                                .filter(([key]) => key !== "item").map(([key, value]) => (
                                                    <p key={key}>
                                                    <span className="capitalize">{key}:</span> {value}
                                                    </p>
                        
                                                )
                                                )}
                                                
                                            </div>
                                        )}
                                        <p className="text-sm mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="flex flex-col items-end sm:items-center sm:ml-auto mt-2 sm:mt-0 gap-2">
                                        <p className="text-md font-semibold whitespace-nowrap">{itemLineTotal.toFixed(2)} EGP</p>
                                        <button
                                            onClick={() => delItem(index)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Checkout Summary Section */}
                    <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit sticky top-20">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p>Subtotal:</p>
                                <p>{subTotal.toFixed(2)} EGP</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Shipping:</p>
                                <p>{SHIPPING_FEE.toFixed(2)} EGP</p>
                            </div>
                            {/* <div className="w-full flex justify-between">
                                <input className="p-2 w-full bg-gray-100 rounded-md border text-sm" placeholder="PROMO CODE"/>
                            </div> */}
                        </div>
                        <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between font-semibold text-lg">
                                <p>Total:</p>
                                <p>{grandTotal.toFixed(2)} EGP</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (token && token.length > 0) {
                                    
                                    checkOut();
                                } else {
                                    navigate('/login');
                                }
                            }}
                            className="w-full mt-6 bg-gradient-to-tr from-black to-gray-700 hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-lg transition-opacity"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg mb-4">Looks like your cart is feeling a bit light!</p>
                    <button 
                        onClick={() => navigate('/shopping')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}

export default Cart