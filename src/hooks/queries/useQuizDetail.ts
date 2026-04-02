import { useQuery } from "@tanstack/react-query";
import learningService from "../../services/learning.service";

export function useQuizDetail(quizId?: number) {
  return useQuery({
    queryKey: ["learning", "quiz-detail", quizId],
    queryFn: () => learningService.getQuizDetail(quizId!),
    enabled: Boolean(quizId),
  });
}
