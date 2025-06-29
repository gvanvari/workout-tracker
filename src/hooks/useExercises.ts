import { useEffect, useState } from 'react';
import { Exercise } from '../types/exercise';
import { fetchExercises, addExercise, fetchExerciseHistory } from '../services/api';

function useExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadExercises() {
            try {
                const data = await fetchExercises();
                setExercises(data as Exercise[]);
            } catch (err) {
                setError('Failed to fetch exercises');
            } finally {
                setLoading(false);
            }
        }

        loadExercises();
    }, []);

    async function addNewExercise(exercise: Exercise) {
        try {
            const newExercise = await addExercise(exercise) as Exercise;
            setExercises((prev) => [...prev, newExercise]);
        } catch (err) {
            setError('Failed to add exercise');
        }
    }

    async function getHistory(exerciseName: string) {
        try {
            const history = await fetchExerciseHistory(exerciseName);
            return history;
        } catch (err) {
            setError('Failed to fetch exercise history');
            return [];
        }
    }

    return {
        exercises,
        loading,
        error,
        addNewExercise,
        getHistory,
    };
}

export default useExercises;