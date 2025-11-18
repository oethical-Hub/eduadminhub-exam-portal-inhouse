export const getUserInitial = (name?: string, email?: string): string => {
  if (name && typeof name === "string") {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && typeof email === "string") {
    return email.trim().charAt(0).toUpperCase();
  }
  return "A";
};

