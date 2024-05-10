import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './layout.module.css'
import SignInButton from './components/sign-in/login';
import Link from 'next/link';

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Business and Computing',
  description: 'Business and Computing Dashboard',
}

const drawerWidth = 240;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald&family=Poppins&family=Roboto:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className={`${styles.page} ${inter.className}`}>
      <Box sx={{ display: 'flex' }} className={styles.boxLayout}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Commerce and Technology Dept
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        
        <Toolbar>
          <SignInButton/>
        </Toolbar>
        <Divider />
        <List>
          {
            [
                {label: 'Home', href: "/", icon: <MailIcon />},
                {label: 'Planning', href: "/planning", icon: <MailIcon />},
                {label: 'Formative', href: "/formative-check/classes", icon: <MailIcon />},
                {label: 'Homework', href: "/homework-check", icon: <MailIcon />}
              ].map((mi: {label: string, href: string, icon: any}, i) => (
              <Link href={mi.href}>
              <ListItem key={mi.label} disablePadding>
                <ListItemButton>
                <ListItemIcon>
                  {mi.icon}
                </ListItemIcon>
                <ListItemText primary={mi.label} />
                </ListItemButton>
              </ListItem>
              </Link>
              ) 

            )
            
          }
          
        </List>
        <Divider />
        <List>
          {['Profile'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        className={styles.boxLayout}
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
  
        {children}
        
      </Box>
    </Box>
        
        
      </body>

    </html>
  )
}

