"use client";

import { SessionProvider } from "next-auth/react";

import React from "react";
import {ImageKitProvider, IKImage} from "imagekitio-next"

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export default function Providers({children}: {children: React.ReactNode}) {
    const authenticator = async() => {
        try {
            const res = await fetch("/api/imagekit-auth");
            if(!res.ok) {
                throw new Error("Failed to authenticate");
            }
            const data  = await res.json();
            return data;
        } catch (error) {
            throw error
        }
    }

    return (
        <SessionProvider refetchInterval={5*30}>
            <ImageKitProvider
                publicKey={publicKey}
                urlEndpoint={urlEndPoint}
                authenticator={authenticator}
            >
                {children}
            </ImageKitProvider>
        </SessionProvider>
    )
}