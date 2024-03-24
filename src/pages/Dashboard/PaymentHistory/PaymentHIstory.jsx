import { useQuery } from "@tanstack/react-query";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHIstory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments =[] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/${user.email}`);
      return res.data;
    },
});
console.log(payments);
  return (
    <div>
      <SectionTitle
        heading={"Add a Glance"}
        subHeading={"Payment history"}
      ></SectionTitle>
      <h2 className="text-3xl">Total Payments: {payments?.length}</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Transaction Id</th>
              <th> Statues</th>
              <th>Total Price</th>
              <th>Present Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment,i) => (
              <tr key={payment._id}>
                <th>{i+1}</th>
                <td>{user.email}</td>
                <td>{payment.transactionId}</td>
                <td>{payment.status}</td>
                <td> ${payment.price}</td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHIstory;
