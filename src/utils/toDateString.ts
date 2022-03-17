import {Timestamp} from "firebase/firestore";
import { format } from 'date-fns';

export const toDateString = (date: Timestamp, dateFormat='dd.MM.yyyy HH:mm [zzz]') => {
    return format(date.toDate(), dateFormat)
}

export default toDateString;