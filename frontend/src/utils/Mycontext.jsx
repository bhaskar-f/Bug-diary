import api from "./axios.jsx";
import { createContext, useEffect, useState } from "react";

export const bugContext = createContext();

export default function Context(props) {
  const [bugs, setBugs] = useState([]);

  async function getBugs(params = {}) {
    try {
      const bugsdata = await api.get("/bugs", {
        params: {
          page: 1,
          limit: 200,
          ...params,
        },
      });
      setBugs(bugsdata.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (
      localStorage.getItem("token") !== null ||
      sessionStorage.getItem("token") !== null
    ) {
      getBugs();
    }
  }, []);

  return (
    <bugContext.Provider value={{ bugs, setBugs, getBugs }}>
      {props.children}
    </bugContext.Provider>
  );
}
