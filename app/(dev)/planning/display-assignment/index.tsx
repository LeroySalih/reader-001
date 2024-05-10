import { format, formatDistance, formatRelative, subDays, startOfWeek, addWeeks, subWeeks, differenceInWeeks, differenceInDays, endOfWeek } from 'date-fns'
import parseISO from 'date-fns/parseISO'

import styles from './display-assignment.module.css'


const formatWeeksDistance = (dueDateTime: string) => {
    
    const diff = differenceInWeeks(startOfWeek(parseISO(dueDateTime)), startOfWeek(Date.now()) );

    if (diff == 0) return 'Current';
    if (diff == 1) return `In ${diff} week`;
    if (diff == -1) return `1 week ago`;
    if (diff > 1) return  `In ${diff} weeks`;
    if (diff < -1) return  `${-diff} weeks ago`;
    
}

export default function DisplayAssignment ({title, status, dueDateTime, instructions}: {title: string, status: string, dueDateTime: string, instructions: string}) {
    return <div className={styles.cell}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subHeader}>
            <div className={styles.dueDateTime}>For Week: {format(startOfWeek(parseISO(dueDateTime)), "yyyy-MM-dd")}</div>
            <div className={styles.dueDateTime}>{ formatWeeksDistance(dueDateTime) }</div>
            <div className={styles.status}>{status}</div>
        </div>
        <div>
            <div dangerouslySetInnerHTML={{__html:instructions}}></div>{}
        </div>
    </div>
}