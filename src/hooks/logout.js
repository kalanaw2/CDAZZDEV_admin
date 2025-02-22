const useLogout = () => {
    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userID')
        window.location.href = "/login";
    };

    return { logout };
};

export default useLogout;
