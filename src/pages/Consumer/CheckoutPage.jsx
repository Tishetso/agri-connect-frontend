import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";


function CheckoutPage(){

    const {cartId} = useParams();
    const navigate = useNavigate();
    const [ cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData,setFormData] = useState({
        deliveryAddress:'',
        contactNumber:'',
        deliveryNotes: '',
        paymentMethod: 'cash'
    });

    useEffect(() => {
        fetchCartDetails();
    }, [cartId]);

    const fetchCartDetails = async () => {
        try{
            setLoading(true);
          //get the user
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch('http://localhost:8080/api/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer {user.token}`
                }
            });

            if(!response.ok){
                throw new Error('Failed to fetch cart');
            }

            const carts = await response.json();
            const selectedCart = carts.find(c => c.id === parseInt(cartId));

            if (!selectedCart){
                toast.error('Cart not found');
                navigate('/consumer/cart');
                return;
            }

            setCart(selectedCart);

        }catch (err){
            console.error('Error fetching  cart', err);
            toast.error('Failed tot load checkout. Please try again.');
            navigate('/consumer/cart');
        }finally{
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name,value} = e.target;

    }

}

export default CheckoutPage;