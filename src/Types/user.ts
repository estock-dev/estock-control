export type User = {
    uid: string; // Unique identifier for the user
    email: string;
    firstName?: string;
    lastName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    photoURL?: string; // This will be used later for social logins
    isAdmin?: boolean;
  };
  