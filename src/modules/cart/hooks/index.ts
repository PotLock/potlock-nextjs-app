import { prop } from "remeda";

import { useTypedSelector } from "@/store";

import { CART_KEY } from "../constants";

export const useCart = () => ({ ...useTypedSelector(prop(CART_KEY)) });
