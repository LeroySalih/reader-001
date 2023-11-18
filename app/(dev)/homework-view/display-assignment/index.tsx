import { format, formatDistance, formatRelative, subDays, startOfWeek, addWeeks, subWeeks, differenceInWeeks, differenceInDays, endOfWeek } from 'date-fns'
import parseISO from 'date-fns/parseISO'

import styles from './display-assignment.module.css'

export default function DisplayAssignment ({title, status, dueDateTime}: {title: string, status: string, dueDateTime: string}) {
    return <div className={styles.cell}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subHeader}>
            <div className={styles.dueDateTime}>{format(parseISO(dueDateTime), "yyyy-MM-dd")}</div>
            <div className={styles.status}>{status}</div>
        </div>
    </div>
}