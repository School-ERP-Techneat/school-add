import { useEffect, useState } from "react";

const useUserRole = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return role;
};

export default useUserRole;
