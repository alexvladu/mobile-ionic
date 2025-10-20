import axios from "axios";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    return response.data;

  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Autentificare eșuată");
    }
  }
};
