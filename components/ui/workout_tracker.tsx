import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';

type Workout = {
    type: string;
    sets: { time: Date; setNumber: number }[];
    startTime: Date;
};

const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
    const [workoutType, setWorkoutType] = useState('');
    const [setCount, setSetCount] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const startWorkout = () => {
        setCurrentWorkout({
            type: workoutType,
            sets: [],
            startTime: new Date(),
        });
        setStartTime(new Date());
    };

    const recordSet = () => {
        if (currentWorkout) {
            const newSet = {
                time: new Date(),
                setNumber: setCount + 1,
            };
            setCurrentWorkout({
                ...currentWorkout,
                sets: [...currentWorkout.sets, newSet],
            });
            setSetCount(setCount + 1);
        }
    };

    const endWorkout = () => {
        if (currentWorkout) {
            setWorkouts([...workouts, currentWorkout]);
            setCurrentWorkout(null);
            setWorkoutType('');
            setSetCount(0);
            setStartTime(null);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout Tracker</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter workout type"
                value={workoutType}
                onChangeText={setWorkoutType}
            />
            <Button title="Start Workout" onPress={startWorkout} />
            {currentWorkout && (
                <View>
                    <Text>Workout Type: {currentWorkout.type}</Text>
                    <Text>Start Time: {startTime ? startTime.toLocaleTimeString() : 'N/A'}</Text>
                    <Button title="Record Set" onPress={recordSet} />
                    <Button title="End Workout" onPress={endWorkout} />
                    <FlatList
                        data={currentWorkout.sets}
                        keyExtractor={(item) => item.setNumber.toString()}
                        renderItem={({ item }) => (
                            <Text>Set {item.setNumber} - {item.time.toLocaleTimeString()}</Text>
                        )}
                    />
                </View>
            )}
            <FlatList
                data={workouts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.workout}>
                        <Text>Workout Type: {item.type}</Text>
                        <Text>Start Time: {new Date(item.startTime).toLocaleTimeString()}</Text>
                        {item.sets.map((set) => (
                            <Text key={set.setNumber}>Set {set.setNumber} - {new Date(set.time).toLocaleTimeString()}</Text>
                        ))}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
    workout: {
        marginBottom: 20,
    },
});

export default WorkoutTracker;