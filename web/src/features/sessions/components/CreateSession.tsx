import { useCreateSession } from "../api/createSession";

interface CreateSessionProps {
  courseId: string;
}

export function CreateSession(props: CreateSessionProps) {
  const { courseId } = props;
  const createSessionMutation = useCreateSession();

  return (
    <>
      <button
        type="button"
        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={() => createSessionMutation.mutate({ course_id: courseId })}
      >
        Add Session
      </button>
    </>
  );
}
