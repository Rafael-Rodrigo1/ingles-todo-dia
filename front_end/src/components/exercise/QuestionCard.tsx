import { useEffect, useState } from "react";
import { getAlternativesByQuestion } from "../../services/alternativeService.ts";
import type { Alternative } from "../../types/alternative.ts";
import type { Question } from "../../types/question.ts";

interface QuestionCardProps {
    question: Question;
    index: number;
    onAnswer: (questionId: number, alternativeId: number) => void;
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



        if (!selectedAlternative) {
            return;
        }

        setAnswered(true);
        onAnswer(
            question.id,
            selectedAlternative.id
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
                                            isSelected
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            isSelected
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                            {String.fromCharCode(65 + alternativeIndex)}
                                    </span>
                                       <span
                                           className={`text-sm ${
                                               isSelected
                                                   ? "font-medium text-blue-900"
                                                   : "text-slate-700"
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
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="font-medium text-blue-700">
                                Resposta confirmada!
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                                Sua alternativa foi registrada.
                                O resultado será apresentado após a correção do exercício.
                            </p>
                        </div>
                )}
            </div>
        </div>
    );
}