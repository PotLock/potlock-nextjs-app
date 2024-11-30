import { prop } from "remeda";

import { useGlobalStoreSelector } from "@/store";

import { CART_KEY } from "../constants";

export const useCart = () => ({ ...useGlobalStoreSelector(prop(CART_KEY)) });
