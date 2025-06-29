import React, { useState } from 'react';
import useExercises from '../../hooks/useExercises';
import Input from '../UI/Input';
import Button from '../UI/Button';

const AddSet: React.FC = () => {
    const { addNewExercise } = useExercises();
    const [exerciseName, setExerciseName] = useState('');
    const [setNumber, setSetNumber] = useState<number | ''>('');
    const [repetitions, setRepetitions] = useState<number | ''>('');
    const [rpe, setRpe] = useState<number | ''>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (exerciseName && setNumber && repetitions && rpe) {
            addNewExercise({
                date: new Date().toISOString().split('T')[0],
                name: exerciseName,
                sets: setNumber,
                weight: 0, // Placeholder for weight, can be added later
                repetitions,
                rpe,
            });
            setExerciseName('');
            setSetNumber('');
            setRepetitions('');
            setRpe('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise Name"
            />
            <Input
                type="number"
                value={setNumber}
                onChange={(e) => setSetNumber(Number(e.target.value))}
                placeholder="Set Number"
                min="1"
            />
            <Input
                type="number"
                value={repetitions}
                onChange={(e) => setRepetitions(Number(e.target.value))}
                placeholder="Repetitions"
                min="1"
            />
            <Input
                type="number"
                value={rpe}
                onChange={(e) => setRpe(Number(e.target.value))}
                placeholder="RPE (1-10)"
                min="1"
                max="10"
            />
            <Button type="submit">Add Set</Button>
        </form>
    );
};

export default AddSet;