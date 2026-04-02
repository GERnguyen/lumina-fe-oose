import { useQuery } from "@tanstack/react-query";
import learningService from "../../services/learning.service";

export function useLectureDetail(lectureId?: number) {
  return useQuery({
    queryKey: ["learning", "lecture-detail", lectureId],
    queryFn: () => learningService.getLectureDetail(lectureId!),
    enabled: Boolean(lectureId),
  });
}
