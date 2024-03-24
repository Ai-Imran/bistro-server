import { loadStripe } from "@stripe/stripe-js";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { Elements } from "@stripe/react-stripe-js";
import ChekoutFrom from "./ChekoutFrom";

const stripePromise = loadStripe(`pk_test_51Owa5EP9VSKwCCX7jgKxgtqP0XKOveYBgOIy1T9p6GexUkVNV0pfKSjfaKq1Rc0X4F9emZWsTUPEwObEZ1j4GK8F001PgA6wiF`);
const PayMent = () => {
  return (
    <div>
      <SectionTitle
        heading={"Payment"}
        subHeading={"please payment here"}
      ></SectionTitle>
      <div>
        <Elements stripe={stripePromise}>
          <ChekoutFrom />
        </Elements>
      </div>
    </div>
  );
};

export default PayMent;
