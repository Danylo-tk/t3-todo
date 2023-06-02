import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { openSignUp } = useClerk();

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.isSignedIn) {
      void router.push("/todos");
    }
  }, [user.isSignedIn, router]);

  return (
    <main className="">
      <ul className="flex w-full justify-between p-6">
        <li className="leading-[4rem]">T3 Todo</li>
        <li>
          <SignOutButton />
        </li>
        <li>
          <button
            type="button"
            className="inline-flex h-16 items-center rounded-lg bg-blue-700 px-5 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign In
          </button>
        </li>
      </ul>
      <div className="my-5 text-center">
        <h1>Welcome to T3 todo app!</h1>
        <p>
          This is an example of applying T3 stack for creating my todo
          application. <br /> Sign in to continue.
        </p>
      </div>

      <div className="my-10 flex justify-center gap-5">
        <a
          onClick={() => openSignUp()}
          className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in &rarr;
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Show the sign in modal
          </p>
        </a>
        <a
          href="#"
          className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            See the Code &rarr;
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Have a look at a code base
          </p>
        </a>
      </div>
    </main>
  );
};

export default Home;
