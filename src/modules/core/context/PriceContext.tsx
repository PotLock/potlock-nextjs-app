// import React, { ReactNode, createContext, useContext } from "react";

// import { useQuery } from "@tanstack/react-query";

// import { fetchNearPrice } from "@/common/api/coingecko";

// interface PriceContextType {
//   price?: number;
//   error?: Error | null;
//   isLoading: boolean;
// }

// const PriceContext = createContext<PriceContextType | undefined>(undefined);

// export const PriceProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const { data, error, isLoading } = useQuery<number, Error>({
//     queryKey: ["nearPrice"],
//     queryFn: fetchNearPrice,
//   });

//   return (
//     <PriceContext.Provider
//       value={{ price: data, error: error ?? null, isLoading }}
//     >
//       {children}
//     </PriceContext.Provider>
//   );
// };

// export const usePrice = (): PriceContextType => {
//   const context = useContext(PriceContext);
//   if (context === undefined) {
//     throw new Error("usePrice must be used within a PriceProvider");
//   }
//   return context;
// };
