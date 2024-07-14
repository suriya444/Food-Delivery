import { createContext, useEffect, useState } from "react";
import axios from 'axios'
// import { food_list } from '../assets/assets';  //phele yaha se le rhe the food_list

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-backand.onrender.com";
    const [token, setToken] = useState("");
    const [food_list, setFood_list] = useState([]) //yaha hum log food_list backend se lene ke liye kr rhe  -- assets file se nhi lenge food_list ab

    const addToCart = async (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}));
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }


    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems]);

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
            {
                if(cartItems[item] > 0){
                   let itemInfo = food_list.find((product) => product._id === item);
                   totalAmount += itemInfo.price * cartItems[item]; 
                }
            }
            return totalAmount;
    }

    const fetchFoodList = async () => {  //foodlist ko fetch karne ke liye function
        const responce = await axios.get(url+"/api/food/list");
        setFood_list(responce.data.data);
    }

    const loadCartData = async(token) => {
        const responce = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(responce.data.cartData)
    }

    useEffect(() => {  
        async function loadData() {
            await fetchFoodList(); // foodfetch ke liye
            if(localStorage.getItem("token")){  // ye reload karne pr khud logout ho ja rha tha usko nhi hone ke liye hai
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {  //iske andar jo v pass krenge usko kahi v use kr skte ab
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;


