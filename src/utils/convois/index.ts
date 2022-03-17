import {Timestamp} from "firebase/firestore";
import {MapLocation} from "../../components/map/models";

// interface ConvoiProps {
//     id: string;
//     project: string;
//     name: string;
//     destination: MapLocation;
//     etd: Timestamp;
//     createdAt: Timestamp;
// }

export type Convoi = {
    id: string;
    project: string;
    name: string;
    destination: MapLocation;
    etd: Timestamp;
    createdAt: Timestamp;
}

export * from './useConvoi';
export * from './useConvois';
