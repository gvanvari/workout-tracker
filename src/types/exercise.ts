export interface ExerciseSet {
    setNumber: number;
    weight: number; // in lbs
    repetitions: number;
    rpe: number; // Rate of Perceived Exertion
}

export interface Exercise {
    date: string; // formatted as 'MM/DD/YYYY'
    name: string; // unique name for the exercise
    warmup?: ExerciseSet; // optional warmup set
    sets: ExerciseSet[]; // array of sets for the exercise
}