import { SignOutButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";

const CreateTodoWizzard = () => {
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.todo.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.todo.getAll.invalidate();
    },
  });

  return (
    <div className="flex h-16 justify-between gap-5">
      <input
        type="text"
        placeholder="Enter your todo"
        className="h-full w-96 rounded-lg border border-solid border-gray-700 bg-gray-800 p-2 text-lg text-white focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ todoText: input });
            }
          }
        }}
        disabled={isLoading}
      />

      {input === "" && (
        <div>
          <button
            type="button"
            className="flex h-16 w-24 cursor-default items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-center text-lg font-medium text-white opacity-60"
          >
            +
          </button>
        </div>
      )}
      {input !== "" && !isLoading && (
        <button
          type="button"
          className="flex h-16 w-24 items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={() => mutate({ todoText: input })}
        >
          +
        </button>
      )}
      {isLoading && (
        <div className="flex w-24 items-center justify-center">
          <LoadingSpinner size={32} />
        </div>
      )}
    </div>
  );
};

interface TodoProps {
  todo: {
    id: string;
    todoText: string;
    isDone: boolean;
  };
}

const Todo = ({ todo }: TodoProps) => {
  const [isEditedTodo, setIsEditTodo] = useState(false);
  const [todoText, setTodoText] = useState(todo.todoText);

  const ctx = api.useContext();

  const { mutate: deleteTodo, isLoading: isDeleting } =
    api.todo.delete.useMutation({
      onSuccess: () => {
        void ctx.todo.getAll.invalidate();
      },
    });
  const { mutate: updateTodo } = api.todo.update.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodoText(e.target.value);
  };

  return (
    <div key={todo.id}>
      {isEditedTodo ? (
        <div className="flex gap-2">
          <div className="h-40 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 font-normal text-white shadow">
            <textarea
              autoFocus
              value={todoText}
              onChange={handleInputChange}
              rows={5}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (todoText !== "") {
                    setIsEditTodo(false);
                    updateTodo({ todoId: todo.id, newTodoText: todoText });
                  } else {
                    deleteTodo({ todoId: todo.id });
                  }
                }
              }}
              className="w-full resize-none bg-gray-800 text-white outline-none"
            />
          </div>
          <div className="flex flex-col items-center justify-around">
            <button
              type="button"
              onClick={() => {
                if (todoText !== "") {
                  setIsEditTodo(false);
                  updateTodo({ todoId: todo.id, newTodoText: todoText });
                } else {
                  deleteTodo({ todoId: todo.id });
                }
              }}
              disabled={isDeleting}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-200 px-5 py-2 text-center text-lg font-medium text-white hover:bg-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              ✏️
            </button>
            {isDeleting ? (
              <div className="flex h-12 w-12 items-center justify-center">
                <LoadingSpinner size={32} />
              </div>
            ) : (
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => deleteTodo({ todoId: todo.id })}
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <p className="${isDone ? } h-40 w-full overflow-scroll rounded-lg border border-gray-700 bg-gray-800 p-4 font-normal text-white shadow">
            {todoText}
          </p>
          <div className="flex h-40 flex-col justify-around">
            <button
              type="button"
              onClick={() => {
                setIsEditTodo(true);
              }}
              disabled={isDeleting}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              ✏️
            </button>
            {isDeleting ? (
              <div className="flex h-12 w-12 items-center justify-center">
                <LoadingSpinner size={32} />
              </div>
            ) : (
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => deleteTodo({ todoId: todo.id })}
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TodosFeed = () => {
  const { data: todos, isLoading } = api.todo.getAll.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!todos) return <div>Smth went wrong...</div>;

  return (
    <div className="flex flex-col gap-4">
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

const Todos: NextPage = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="m-auto max-w-lg">
      <div className="flex flex-col gap-3 p-2">
        <div className="flex gap-3">
          <Image
            src={user.profileImageUrl}
            alt="Profile picture"
            className="h-14 w-14 rounded-full border border-solid border-white"
            width={56}
            height={56}
          />
          <h1 className="my-auto text-lg text-white">
            Hello,{" "}
            <span className="font-bold text-blue-700 ">@{user?.username}</span>,
            you&apos;ve got a ton of tasks to do!
          </h1>
        </div>
        <p className="text-white">
          <SignOutButton />
        </p>
      </div>

      <CreateTodoWizzard />

      <div className="h-8"></div>
      <TodosFeed />
    </div>
  );
};

export default Todos;
