-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            active BOOLEAN,
                            order_index INTEGER NOT NULL,
                            created_at TIMESTAMP NOT NULL,
                            updated_at TIMESTAMP,

                            color VARCHAR(20),
                            name VARCHAR(80) NOT NULL,
                            slug VARCHAR(80) NOT NULL UNIQUE,
                            icon VARCHAR(100),
                            description TEXT
);


-- =========================================================
-- LESSONS
-- =========================================================

CREATE TABLE lessons (
                         id BIGSERIAL PRIMARY KEY,

                         category_id BIGINT NOT NULL,

                         estimated_time INTEGER NOT NULL,
                         order_index INTEGER NOT NULL,
                         published BOOLEAN NOT NULL,

                         created_at TIMESTAMP NOT NULL,
                         updated_at TIMESTAMP,

                         title VARCHAR(150) NOT NULL,
                         slug VARCHAR(180) NOT NULL UNIQUE,
                         description TEXT,
                         difficulty VARCHAR(255) NOT NULL,
                         level VARCHAR(255) NOT NULL,
                         short_description VARCHAR(255),
                         thumbnail VARCHAR(255),

                         CONSTRAINT fk_lessons_category
                             FOREIGN KEY (category_id)
                                 REFERENCES categories(id)
);


-- =========================================================
-- LESSON SECTIONS
-- =========================================================

CREATE TABLE lesson_sections (
                                 id BIGSERIAL PRIMARY KEY,

                                 lesson_id BIGINT NOT NULL,

                                 order_index INTEGER NOT NULL,

                                 created_at TIMESTAMP NOT NULL,
                                 updated_at TIMESTAMP,

                                 content TEXT,
                                 title VARCHAR(255) NOT NULL,
                                 type VARCHAR(255) NOT NULL,

                                 CONSTRAINT fk_lesson_sections_lesson
                                     FOREIGN KEY (lesson_id)
                                         REFERENCES lessons(id)
);


-- =========================================================
-- EXAMPLES
-- =========================================================

CREATE TABLE examples (
                          id BIGSERIAL PRIMARY KEY,

                          lesson_section_id BIGINT,

                          created_at TIMESTAMP NOT NULL,
                          updated_at TIMESTAMP,

                          audio_url VARCHAR(255),
                          english TEXT,
                          explanation VARCHAR(255),
                          portuguese TEXT,

                          CONSTRAINT fk_examples_lesson_section
                              FOREIGN KEY (lesson_section_id)
                                  REFERENCES lesson_sections(id)
);


-- =========================================================
-- AUDIOS
-- =========================================================

CREATE TABLE audios (
                        id BIGSERIAL PRIMARY KEY,

                        lesson_section_id BIGINT,

                        duration INTEGER,

                        created_at TIMESTAMP NOT NULL,
                        updated_at TIMESTAMP,

                        transcript VARCHAR(255),
                        url VARCHAR(255) NOT NULL,

                        CONSTRAINT fk_audios_lesson_section
                            FOREIGN KEY (lesson_section_id)
                                REFERENCES lesson_sections(id)
);


-- =========================================================
-- IMAGES
-- =========================================================

CREATE TABLE images (
                        id BIGSERIAL PRIMARY KEY,

                        lesson_section_id BIGINT,

                        created_at TIMESTAMP NOT NULL,
                        updated_at TIMESTAMP,

                        alt_text VARCHAR(255),
                        description VARCHAR(255),
                        url VARCHAR(255) NOT NULL,

                        CONSTRAINT fk_images_lesson_section
                            FOREIGN KEY (lesson_section_id)
                                REFERENCES lesson_sections(id)
);


-- =========================================================
-- EXERCISES
-- =========================================================

CREATE TABLE exercises (
                           id BIGSERIAL PRIMARY KEY,

                           lesson_id BIGINT NOT NULL,

                           active BOOLEAN NOT NULL,
                           order_index INTEGER NOT NULL,
                           passing_score INTEGER NOT NULL,
                           time_limit INTEGER NOT NULL,

                           created_at TIMESTAMP NOT NULL,
                           updated_at TIMESTAMP,

                           title VARCHAR(150) NOT NULL,
                           description TEXT,
                           difficulty VARCHAR(255) NOT NULL,

                           CONSTRAINT fk_exercises_lesson
                               FOREIGN KEY (lesson_id)
                                   REFERENCES lessons(id)
);


-- =========================================================
-- QUESTIONS
-- =========================================================

CREATE TABLE questions (
                           id BIGSERIAL PRIMARY KEY,

                           exercise_id BIGINT,

                           order_index INTEGER NOT NULL,
                           points INTEGER NOT NULL,

                           created_at TIMESTAMP NOT NULL,
                           updated_at TIMESTAMP,

                           audio_url VARCHAR(255),
                           explanation TEXT,
                           image_url VARCHAR(255),
                           statement TEXT,

                           CONSTRAINT fk_questions_exercise
                               FOREIGN KEY (exercise_id)
                                   REFERENCES exercises(id)
);


-- =========================================================
-- ALTERNATIVES
-- =========================================================

CREATE TABLE alternatives (
                              id BIGSERIAL PRIMARY KEY,

                              question_id BIGINT NOT NULL,

                              correct BOOLEAN NOT NULL,

                              created_at TIMESTAMP NOT NULL,
                              updated_at TIMESTAMP,

                              text TEXT,

                              CONSTRAINT fk_alternatives_question
                                  FOREIGN KEY (question_id)
                                      REFERENCES questions(id)
);


-- =========================================================
-- FAVORITES
-- =========================================================

CREATE TABLE favorites (
                           id BIGSERIAL PRIMARY KEY,

                           user_id BIGINT NOT NULL,
                           lesson_id BIGINT NOT NULL,

                           created_at TIMESTAMP NOT NULL,
                           updated_at TIMESTAMP,

                           CONSTRAINT fk_favorites_user
                               FOREIGN KEY (user_id)
                                   REFERENCES users(id),

                           CONSTRAINT fk_favorites_lesson
                               FOREIGN KEY (lesson_id)
                                   REFERENCES lessons(id),

                           CONSTRAINT uk_favorites_user_lesson
                               UNIQUE (user_id, lesson_id)
);


-- =========================================================
-- USER PROGRESS
-- =========================================================

CREATE TABLE user_progress (
                               id BIGSERIAL PRIMARY KEY,

                               user_id BIGINT NOT NULL,
                               lesson_id BIGINT NOT NULL,

                               completed BOOLEAN NOT NULL,
                               current_section INTEGER NOT NULL,
                               exercises_completed INTEGER NOT NULL,
                               percentage DOUBLE PRECISION NOT NULL,
                               score INTEGER NOT NULL,
                               total_study_time INTEGER NOT NULL,

                               last_access TIMESTAMP,

                               created_at TIMESTAMP NOT NULL,
                               updated_at TIMESTAMP,

                               CONSTRAINT fk_user_progress_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id),

                               CONSTRAINT fk_user_progress_lesson
                                   FOREIGN KEY (lesson_id)
                                       REFERENCES lessons(id),

                               CONSTRAINT uk_user_progress_user_lesson
                                   UNIQUE (user_id, lesson_id)
);


-- =========================================================
-- STUDY SESSIONS
-- =========================================================

CREATE TABLE study_sessions (
                                id BIGSERIAL PRIMARY KEY,

                                user_id BIGINT NOT NULL,
                                lesson_id BIGINT NOT NULL,

                                completed BOOLEAN NOT NULL,
                                correct_answers INTEGER NOT NULL,
                                duration INTEGER NOT NULL,
                                score INTEGER NOT NULL,
                                wrong_answers INTEGER NOT NULL,

                                start_time TIMESTAMP NOT NULL,
                                end_time TIMESTAMP,

                                created_at TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP,

                                CONSTRAINT fk_study_sessions_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users(id),

                                CONSTRAINT fk_study_sessions_lesson
                                    FOREIGN KEY (lesson_id)
                                        REFERENCES lessons(id)
);


-- =========================================================
-- TAGS
-- =========================================================

CREATE TABLE tags (
                      id BIGSERIAL PRIMARY KEY,

                      created_at TIMESTAMP NOT NULL,
                      updated_at TIMESTAMP,

                      name VARCHAR(60) NOT NULL,
                      slug VARCHAR(60) NOT NULL UNIQUE
);


-- =========================================================
-- VOCABULARY CATEGORIES
-- =========================================================

CREATE TABLE tb_vocabulary_category (
                                        id BIGSERIAL PRIMARY KEY,

                                        active BOOLEAN,
                                        order_index INTEGER,

                                        created_at TIMESTAMP NOT NULL,
                                        updated_at TIMESTAMP,

                                        name VARCHAR(100) NOT NULL UNIQUE,
                                        slug VARCHAR(120) NOT NULL UNIQUE,
                                        description TEXT,
                                        icon VARCHAR(255)
);


-- =========================================================
-- VOCABULARY WORDS
-- =========================================================

CREATE TABLE tb_vocabulary_word (
                                    id BIGSERIAL PRIMARY KEY,

                                    category_id BIGINT NOT NULL,

                                    created_at TIMESTAMP NOT NULL,
                                    updated_at TIMESTAMP,

                                    audio_url VARCHAR(255),
                                    english VARCHAR(255) NOT NULL,
                                    example_english TEXT,
                                    example_portuguese TEXT,
                                    image_url VARCHAR(255),
                                    level VARCHAR(255),
                                    observation TEXT,
                                    portuguese VARCHAR(255) NOT NULL,
                                    pronunciation VARCHAR(255),

                                    CONSTRAINT fk_vocabulary_word_category
                                        FOREIGN KEY (category_id)
                                            REFERENCES tb_vocabulary_category(id)
);