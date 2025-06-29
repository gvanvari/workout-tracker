import axios from 'axios';
import { Exercise } from '../types/exercise';
import { API_BASE_URL } from '../utils/constants';

export async function fetchExercises(): Promise<Exercise[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/exercises`);
        return response.data as Exercise[];
    } catch (error) {
        throw new Error('Error fetching exercises');
    }
};

export async function addExercise(exercise: Exercise): Promise<Exercise> {
    try {
        const response = await axios.post(`${API_BASE_URL}/exercises`, exercise);
        return response.data as Exercise;
    } catch (error) {
        throw new Error('Error adding exercise');
    }
};

export async function fetchExerciseHistory(exerciseName: string): Promise<Exercise[]>  {
    try {
        const response = await axios.get(`${API_BASE_URL}/exercises/history`, {
            params: { name: exerciseName },
        });
        return response.data as Exercise[];
    } catch (error) {
        throw new Error('Error fetching exercise history');
    }
};