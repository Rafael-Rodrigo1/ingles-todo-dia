import { useEffect, useState } from "react";
import { getAlternativesByQuestion } from "../../services/alternativeService.ts";
import type { Alternative } from "../../types/alternative.ts";
import type { Question } from "../../types/question.ts";

interface QuestionCardProps {
    question: Question;
    index: number;
    onAnswer: (questionId: number, correct: boolean) => void;
}

export function QuestionCard({question, index, onAnswer,} : QuestionCardProps) {
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAlternativeId, setSelectedAlternativeId] = useState<number | null >(null);
    const [answered, setAnswered] = useState(false);
    const selectedAlternative = alternatives.find(
        (alternative) => alternative.id === selectedAlternativeId
    );

    const isCorrect =
        answered && selectedAlternative?.correct === true;

    useEffect(() => {
        async function loadAlternatives() {
            try {
                const data = await getAlternativesByQuestion(
                    question.id
                );

                setAlternatives(data);
            } catch (error) {
                console.error(
                    `Erro ao carregar alternativas da questão ${question.id}:`,
                    error
                );

                setError(
                    "Não foi possível carregar as alternativas."
                );
            } finally {
                setLoading(false);
            }
        }

        loadAlternatives();
    }, [question.id]);

    function handleConfirmAnswer() {
        if (selectedAlternativeId === null) {
            return;
        }

        const selectedAlternative = alternatives.find(
            (alternative) =>
                alternative.id === selectedAlternativeId
        );

        if (!selectedAlternative) {
            return;
        }

        setAnswered(true);

        onAnswer(
            question.id,
            selectedAlternative.correct
        );
    }

    return (
        <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-slate-500">
                        Questão {index + 1}
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                        {question.statement}
                    </p>
                </div>

                <span className="shrink-0 text-xs font-medium text-slate-500">
                    {question.points} pts
                </span>
            </div>

            {question.imageUrl && (
                <img
                    src={question.imageUrl}
                    alt=""
                    className="mt-4 max-h-72 rounded-lg object-cover"
                />
            )}

            {question.audioUrl && (
                <audio
                    controls
                    src={question.audioUrl}
                    className="mt-4 w-full"
                />
            )}

            <div className="mt-4">
                {loading && (
                    <p className="text-sm text-slate-500">
                        Carregando alternativas...
                    </p>
                )}

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    alternatives.length === 0 && (
                        <p className="text-sm text-slate-500">
                            Esta questão ainda não possui alternativas.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    alternatives.length > 0 && (
                        <div className="space-y-2">
                            {alternatives.map((alternative, alternativeIndex) => {
                                const isSelected =
                                    selectedAlternativeId === alternative.id;

                                const showAsCorrect =
                                    answered && alternative.correct;

                                const showAsIncorrect =
                                    answered &&
                                    isSelected &&
                                    !alternative.correct;

                                return (
                                    <button
                                        key={alternative.id}
                                        type="button"
                                        disabled={answered}
                                        onClick={() => {
                                            if (!answered) {
                                                setSelectedAlternativeId(alternative.id);
                                            }
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                                            showAsCorrect
                                                ? "border-emerald-500 bg-emerald-50"
                                                : showAsIncorrect
                                                    ? "border-red-500 bg-red-50"
                                                    : isSelected
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            showAsCorrect
                                                ? "bg-emerald-600 text-white"
                                                : showAsIncorrect
                                                    ? "bg-red-600 text-white"
                                                    : isSelected
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                            {String.fromCharCode(65 + alternativeIndex)}
                                    </span>
                                       <span
                                           className={`text-sm ${
                                               showAsCorrect ? "font-medium text-emerald-900" 
                                                   : showAsIncorrect ? "font-medium text-red-900" 
                                                   : isSelected ? "font-medium text-blue-900" : "text-slate-700"
                                             }`}
                                       >
                                              {alternative.text}
                                      </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                {!loading && !error && alternatives.length > 0 && (
                    <button
                        type="button"
                        onClick={handleConfirmAnswer}
                        disabled={
                            selectedAlternativeId === null || answered
                        }
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {answered ? "Resposta confirmada" : "Confirmar resposta"}
                    </button>
                )}
                {answered && (
                    <div
                        className={`mt-4 rounded-lg border p-4 ${
                            isCorrect
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-red-200 bg-red-50"
                        }`}
                    >
                        <p
                            className={`font-medium ${
                                isCorrect
                                    ? "text-emerald-700"
                                    : "text-red-700"
                            }`}
                        >
                            {isCorrect
                                ? "Resposta correta!"
                                : "Resposta incorreta."}
                        </p>

                        {question.explanation && (
                            <div className="mt-3 border-t border-black/10 pt-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Explicação
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-700">
                                    {question.explanation}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}