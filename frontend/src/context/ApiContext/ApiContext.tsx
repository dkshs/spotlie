import { createContext, PropsWithChildren } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/axios";

import type {
  ApiContextProps,
  ApiLibResponse,
  ApiLibSelectOptions,
  ApiLibTable,
} from "./types";

const ctxInitialValues: ApiContextProps = {
  libApi: {
    from: (table: ApiLibTable) => {
      return {
        select<T = unknown>(
          column: string,
          options?: ApiLibSelectOptions,
        ): Promise<ApiLibResponse<T>> {
          return new Promise((resolve) => {
            resolve({
              data: null,
              error: null,
            });
          });
        },
        insert() {},
        update(id) {},
        delete(id) {},
      };
    },
  },
};

export const ApiContext = createContext<ApiContextProps>(ctxInitialValues);

export function ApiContextProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();

  const libApi = {
    from: (table: ApiLibTable) => {
      return {
        select: async <T = unknown,>(
          column: string,
          options?: ApiLibSelectOptions,
        ) => {
          let eqRequest = false;
          const response: ApiLibResponse<T> = {
            data: null,
            error: null,
          };

          const jwtToken = await getToken({ template: "Backend" });
          const headers = { Authorization: `Bearer ${jwtToken}` };

          if (table === "artists") {
            if (options?.orderBy && options?.orderBy.column !== "name") {
              response.error = {
                message: "Order by column not found",
                status: 400,
              };
              return response;
            }
            if (
              options?.like &&
              options?.like.column !== "id" &&
              options?.like.column !== "name"
            ) {
              response.error = {
                message: "Like column not found",
                status: 400,
              };
              return response;
            }
            if (options?.eq && options?.eq.column !== "id") {
              response.error = {
                message: "Equal column not found",
                status: 400,
              };
              return response;
            } else if (options?.eq && !options?.eq?.value) {
              response.error = {
                message: "Equal must have a value",
                status: 400,
              };
              return response;
            } else if (options?.eq?.value) {
              eqRequest = true;
            }

            if (eqRequest && options?.eq?.value) {
              const { data } = await api.get(`/artist/${options.eq.value}`, {
                headers,
              });
              response.data = data;
            } else {
              const like = options?.like;
              const limit = options?.limit;
              const orderBy = options?.orderBy;

              const orderString = `&orderBy=${orderBy?.column || ""}.${
                orderBy?.ascending || "desc"
              }`;
              const likeString = `${like?.column || ""}=${like?.value || ""}&`;
              const limitString = `limit=${limit}`;

              const { data } = await api.get(
                `/artists?${like ? likeString : ""}${limit ? limitString : ""}${
                  orderBy ? orderString : ""
                }`,
                { headers },
              );
              response.data = data;
            }
          } else if (table === "musics") {
            if (
              options?.orderBy &&
              options?.orderBy.column !== "title" &&
              options?.orderBy.column !== "artist"
            ) {
              response.error = {
                message: "Order by column not found",
                status: 400,
              };
            }
            if (
              options?.like &&
              options?.like.column !== "id" &&
              options?.like.column !== "title" &&
              options?.like.column !== "artist" &&
              options?.like.column !== "participants"
            ) {
              response.error = {
                message: "Like column not found",
                status: 400,
              };
            }
            if (options?.eq && options?.eq.column !== "id") {
              response.error = {
                message: "Equal column not found",
                status: 400,
              };
            } else if (options?.eq && !options?.eq?.value) {
              response.error = {
                message: "Equal must have a value",
                status: 400,
              };
              return response;
            } else if (options?.eq?.value) {
              eqRequest = true;
            }

            if (eqRequest && options?.eq?.value) {
              const { data } = await api.get(`/music/${options.eq.value}`, {
                headers,
              });
              response.data = data;
            } else {
              const like = options?.like;
              const limit = options?.limit;
              const orderBy = options?.orderBy;

              const orderString = `&orderBy=${orderBy?.column || ""}.${
                orderBy?.ascending || "desc"
              }`;
              const likeString = `${like?.column || ""}=${like?.value || ""}&`;
              const limitString = `limit=${limit}`;

              const { data } = await api.get(
                `/musics?${like ? likeString : ""}${limit ? limitString : ""}${
                  orderBy ? orderString : ""
                }`,
                { headers },
              );
              response.data = data;
            }
          } else {
            response.error = { message: "Table not found", status: 400 };
          }

          return response;
        },
        insert: () => {},
        update: (id: string) => {},
        delete: (id: string) => {},
      };
    },
  };

  return (
    <ApiContext.Provider value={{ libApi }}>{children}</ApiContext.Provider>
  );
}
