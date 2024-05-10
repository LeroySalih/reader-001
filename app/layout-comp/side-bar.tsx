import styles from "./local.module.css"
import { Roboto } from 'next/font/google'
import Link from "next/link";
import SignInButton from "../components/sign-in/login";

const roboto = Roboto({weight: "400", subsets: ["latin"]});

type MenuItem = {
    label: string,
    href: string
}

const SideBar = () => {

    const menuItems = [{label:"Home", href: "/"}]

    return <div className={styles.sideBar}>
        <SignInButton/>
        {
            menuItems.map((mi:MenuItem, index: number) => (<div key={index} className={roboto.className}><Link href="">{mi.label}</Link></div>))
        }
        
        </div>
}

export default SideBar;