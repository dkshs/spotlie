import { useContext } from "react";
import { ApiContext } from "@/context/ApiContext";

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    console.warn("ApiContext is undefined in useApi()");
    throw new Error(`useApi must be used within a ApiContextProvider.`);
  }
  return context;
};
