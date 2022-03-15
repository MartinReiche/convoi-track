import {Timestamp} from "firebase/firestore";
import {Location} from "../cars";

export type Convoi = {
    id: string
    project: string
    name: string
    destination: Location
    etd: Timestamp
    createdAt: Timestamp
}

export * from './useConvoi';
export * from './useConvois';
