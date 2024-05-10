import styles from "./local.module.css"
import { Roboto } from 'next/font/google'

const roboto = Roboto({weight: "400", subsets: ["latin"]});



const AppBar = () => {

    return <div className={styles.appBar}>
        <span className={roboto.className}>Commerce and Business Dept Dashboard</span>
        </div>
}

export default AppBar;