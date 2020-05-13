import { Athlete } from "./athlete";
import { Group } from "./group";

export interface AthleteGroupRelationship {
    startDate: Date,
    endDate: Date,
    athlete: Athlete,
    group: Group
}