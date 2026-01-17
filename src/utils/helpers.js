export function calculateTotalVolume(exercises) {
  let totalVolume = 0;
  exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      if (set.completed) {
        totalVolume += set.weight * set.reps;
      }
    });
  });
  return totalVolume;
}

export function calculateMaxWeight(exercises) {
  let maxWeight = 0;
  exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      if (set.completed && set.weight > maxWeight) {
        maxWeight = set.weight;
      }
    });
  });
  return maxWeight;
}

export function generateProgressEntry(workout, exerciseId) {
  const workoutExercise = workout.exercises.find(e => e.exerciseId === exerciseId);
  if (!workoutExercise) return null;

  return {
    date: workout.date,
    exerciseId: exerciseId,
    maxWeight: calculateMaxWeight([workoutExercise]),
    totalVolume: calculateTotalVolume([workoutExercise])
  };
}

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
