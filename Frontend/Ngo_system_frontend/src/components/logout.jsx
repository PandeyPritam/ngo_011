export function logout(navigate) {
  localStorage.removeItem("user");
  if (navigate) navigate("/login");
}