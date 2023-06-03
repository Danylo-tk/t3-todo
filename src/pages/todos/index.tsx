import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

const CreateTodoWizzard = () => {
  const [input, setInput] = useState("");

  const { mutate, isLoading } = api.todo.create.useMutation();

  return (
    <div className="flex h-16 justify-center gap-5">
      <input
        type="text"
        placeholder="Enter your todo"
        className="h-full w-full rounded-lg border border-solid border-black p-2 text-lg focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        type="button"
        className="inline-flex h-16 items-center rounded-lg bg-blue-700 px-5 py-2 text-center text-lg font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => mutate({ todoText: input })}
      >
        Add
      </button>
    </div>
  );
};

const TodosFeed = () => {
  const { data, isLoading } = api.todo.getAll.useQuery();
  const { mutate } = api.todo.delete.useMutation();

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Smth went wrong...</div>;

  return (
    <div className="flex flex-col gap-4">
      {data.map((todo) => (
        <div
          key={todo.id}
          className="flex w-full justify-between rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100"
        >
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {todo.todoText}
          </p>
          <button
            className="boder-solid border border-red-400 p-2"
            onClick={() => mutate({ todoId: todo.id })}
          >
            del
          </button>
        </div>
      ))}
    </div>
  );
};

const Todos: NextPage = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="m-auto w-2/5">
      <div className="flex gap-3 p-2">
        <Image
          src={user.profileImageUrl}
          alt="Profile picture"
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
        />
        <h1 className="my-auto text-lg">
          Hello,{" "}
          <span className="font-bold text-blue-700 ">@{user?.username}</span>,
          you&apos;ve got a ton of tasks to do!
        </h1>
      </div>

      <CreateTodoWizzard />

      <div className="h-8"></div>
      <TodosFeed />
    </div>
  );
};

export default Todos;
