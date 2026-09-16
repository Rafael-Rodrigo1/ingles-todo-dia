CREATE TABLE user_exercise_progress (
   id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,

    completed BOOLEAN NOT NULL DEFAULT FALSE,
    score INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_attempt TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_exercise_progress_user
        FOREIGN KEY (user_id)
            REFERENCES users(id),

    CONSTRAINT fk_user_exercise_progress_exercise
        FOREIGN KEY (exercise_id)
            REFERENCES exercises(id),

    CONSTRAINT uk_user_exercise_progress_user_exercise
        UNIQUE (user_id, exercise_id)
);