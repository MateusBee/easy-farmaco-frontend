export const validateAccess = (access) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return false;
    else return access.includes(user.type);
}