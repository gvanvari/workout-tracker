import React, { useEffect, useState } from 'react';
import { useExercises } from '../../hooks/useExercises';
import { Table } from '../UI/Table';

const ExerciseHistory: React.FC = () => {
    const { fetchExercises, exercises } = useExercises();
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const handleExerciseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExercise(event.target.value);
        const history = exercises.filter(exercise => exercise.name === event.target.value);
        setExerciseHistory(history);
    };

    const uniqueExercises = Array.from(new Set(exercises.map(exercise => exercise.name)));

    return (
        <div>
            <h2>Exercise History</h2>
            <select onChange={handleExerciseChange} value={selectedExercise}>
                <option value="">Select an exercise</option>
                {uniqueExercises.map((exercise, index) => (
                    <option key={index} value={exercise}>{exercise}</option>
                ))}
            </select>
            {exerciseHistory.length > 0 && (
                <div>
                    {Array.from(new Set(exerciseHistory.map(exercise => exercise.setNumber))).map(setNumber => (
                        <Table key={setNumber} data={exerciseHistory.filter(exercise => exercise.setNumber === setNumber)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExerciseHistory;