import { useQuery } from "@tanstack/react-query";
import learningService from "../../services/learning.service";

export function useMyLearningCourses(enabled = true) {
  return useQuery({
    queryKey: ["learning", "my-courses"],
    queryFn: () => learningService.getMyCourses(),
    enabled,
  });
}
