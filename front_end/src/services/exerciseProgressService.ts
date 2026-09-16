import api from "./api";
import type {
    SaveUserExerciseProgress,
    UserExerciseProgress,
} from "../types/userExerciseProgress";

export async function saveExerciseProgress(
    data: SaveUserExerciseProgress
): Promise<UserExerciseProgress> {

    const response = await api.put<UserExerciseProgress>(
        "/exercise-progress",
        data
    );

    return response.data;
}

export async function getExerciseProgressByLesson(
    lessonId: number
): Promise<UserExerciseProgress[]> {

    const response = await api.get<UserExerciseProgress[]>(
        `/exercise-progress/lesson/${lessonId}`
    );

    return response.data;
}