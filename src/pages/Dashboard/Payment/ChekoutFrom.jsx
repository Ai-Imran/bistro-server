import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChekoutFrom = () => {
  const stripe = useStripe();
  const [clientSecret, setClientSecret] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const elements = useElements();
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const [cart,refetch] = useCart();
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  const navigate = useNavigate()

  useEffect(() => {
  if(totalPrice > 0){
    axiosSecure
    .post("/create-payment-intent", { price: totalPrice })
    .then((res) => {
      setClientSecret(res.data.clientSecret)
      // console.log(res.data.clientSecret);
    });
  }
  }, [axiosSecure, totalPrice]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("payment method", error);
      setError(error.message);
    }
    if (paymentMethod) {
      console.log("payment method", paymentMethod);
      setError("");
    }

    // confirm payment
    const {paymentIntent,error: confirmError} =await stripe.confirmCardPayment(clientSecret,{
      payment_method:{
        card:card,
        billing_details:{
          email:user?.email || 'anonymus',
          name:user?.displayName || 'anonymus'
        }
      }

    })
    if(confirmError){
      console.log('confirm error');
    }
    if(paymentIntent){
      console.log(paymentIntent);
      if(paymentIntent.status === "succeeded"){
        setTransactionId(paymentIntent.id);

        // save payment in the database
        const payment = {
          email: user.email,
          transactionId : paymentIntent.id,
          price: totalPrice,
          date : new Date(),
          cartIds : cart.map(item => item._id),
          menuItemIds: cart.map(item => item.menuId),
          status: 'panding'
        }
      const res = await axiosSecure.post('/payments',payment)
      console.log('payment saved' ,res.data);
      refetch()
      if(res.data?.paymentResult?.insertedId){
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your payment succcess",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/dashboard/paymentHistory')
      }
      
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button className="btn btn-primary m-4" type="submit" disabled={!stripe || !clientSecret }>
        Pay
      </button>
      <p className="text-red-600">{error}</p>
      {transactionId && <p className="text-green-600"> Your Transaction id : {transactionId}</p> }
    </form>
  );
};

export default ChekoutFrom;
