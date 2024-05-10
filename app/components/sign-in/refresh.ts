"use server"

import { revalidatePath } from "next/cache"

export const refreshSignIn = () => {
    revalidatePath("/")
}