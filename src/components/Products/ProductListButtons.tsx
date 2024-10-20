"use client"

import { CartIcon } from "@/assets/CartIcon";
import { WishlistIcon } from "@/assets/WishlistIcon";

export function ProductListButtons() {

    return <>
        <span onClick={(e) => e.preventDefault()} tabIndex={0}><WishlistIcon /></span>
        <span onClick={(e) => e.preventDefault()} tabIndex={0}><CartIcon /></span>
    </>
}