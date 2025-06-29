import React, { useEffect, useState } from 'react';
import useExercises from '../../hooks/useExercises';
import Table from '../UI/Table';

const ExerciseHistory: React.FC = () => {
    const { exercises, getHistory } = useExercises();
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);

    useEffect(() => {
        // Optionally, you can fetch all exercises here if needed, or remove this effect if not required
    }, []);

    const handleExerciseChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedExercise(selected);
        if (selected) {
            const history = await getHistory(selected);
            setExerciseHistory(history);
        } else {
            setExerciseHistory([]);
        }
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
                    {Array.from(new Set(exerciseHistory.map(exercise => exercise.setNumber))).map(setNumber => {
                        const filteredData = exerciseHistory.filter(exercise => exercise.setNumber === setNumber);
                        // Define headers based on the keys of the first item, or provide static headers if known
                        const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];
                        // Convert data to array of arrays for Table
                        const tableData = filteredData.map(item => headers.map(header => item[header]));
                        return (
                            <Table key={setNumber} headers={headers} data={tableData} />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExerciseHistory;