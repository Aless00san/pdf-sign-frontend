// api.ts
export interface Document {
  id: string;
  name: string;
  status: string;
  userId: string;
}

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await fetch("http://localhost:3000/api/documents", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  const data = await response.json();

  return data;
};

export const login = async (email: string, password: string) => {
  const response = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const data = await response.json();

  return data;
};

export const register = async (email: string, password: string) => {
  const response = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  const data = await response.json();

  return data;
};

export const logout = async () => {
  const response = await fetch("http://localhost:3000/users/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  const data = await response.json();

  return data;
};

export const autoLogin = async () => {
  try {
    const response = await fetch("http://localhost:3000/users/auto-login", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      return null;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const documentList = async () => {
  const response = await fetch("http://localhost:3000/api/documents", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get document list");
  }

  const data = await response.json();

  return data;
};
