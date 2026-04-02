import { Star, Users, Award } from "lucide-react";
import type { InstructorItem } from "../data/courseDetail.mock";

export interface InstructorProfileProps {
  instructor: InstructorItem;
}

export default function InstructorProfile({
  instructor,
}: InstructorProfileProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <img
          src={instructor.avatarUrl}
          alt={instructor.name}
          className="h-28 w-28 rounded-full object-cover"
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold text-neutral-800">
              {instructor.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{instructor.title}</p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
              <span className="font-medium text-neutral-800">
                {instructor.rating.toFixed(1)}
              </span>
              <span className="text-gray-600">Course rating</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-secondary-500" />
              <span className="font-medium text-neutral-800">
                {instructor.students.toLocaleString()}
              </span>
              <span className="text-gray-600">Students</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary-500" />
              <span className="font-medium text-neutral-800">
                {instructor.courses}
              </span>
              <span className="text-gray-600">Courses</span>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-gray-600">
            {instructor.bio}
          </p>
        </div>
      </div>
    </article>
  );
}
