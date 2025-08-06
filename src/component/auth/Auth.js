import Login from "../log-in/Login";


export const isUserExist = () => {
    return !!sessionStorage.getItem("Social-User")
}

export const getCurrentUser = () => {
    let user = sessionStorage.getItem("Social-User");
    user = JSON.parse(user);
    return user;
}
function Auth({ children }) {
    if (isUserExist())
        return children
    return <Login />
}

export default Auth;