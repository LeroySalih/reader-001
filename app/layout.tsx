import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

import AppBar from "./layout-comp/app-bar";
import SideBar from "./layout-comp/side-bar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Business and Computing',
  description: 'Business and Computing Dashboard',
}
import styles from "./layout.module.css";

import React from 'react';





const RootLayout  = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald&family=Poppins&family=Roboto:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className={` ${inter.className}`}>
        <AppBar/>
        <div style={{display: "flex"}}>
            <SideBar></SideBar>
            <div style={{display: "flex", flexDirection: "column"}}>
            {children}
            </div>
        </div>
    </body>
    </html>
  );
};

export default RootLayout;