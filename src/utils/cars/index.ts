import {Timestamp} from "firebase/firestore";
import {MapLocation} from "../../components/map/models";

export type Car = {
    id: string
    project: string
    convoi: string
    name: string
    numberPlate: string
    crew: number
    guests: number
    from?: MapLocation
    position?: MapLocation
    heading?: MapLocation
    destination?: MapLocation
    updatedAt: Timestamp
}

export * from './useConvoiCars';
export * from './useCarStatus';
