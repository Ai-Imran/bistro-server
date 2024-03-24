import useAuth from "../../../hooks/useAuth";
import { AuthContext } from "../../../providers/AuthProvider";

const UserHome = () => {
    const {user} = useAuth(AuthContext)
    return (
        <div>
            <h2 className="text-2xl">
                Welcome To {user?.displayName ? <span className="text-3xl text-purple-500">{user.displayName}</span> : "Back"}
            </h2>
        </div>
    );
};

export default UserHome;