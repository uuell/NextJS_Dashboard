'use client';
// error.tsx needs to be a Client Component.
// error.tsx is useful for catching all errors, 

// Handling 404 errors with the notFound function
// notFound can be used when you try to fetch a resource that doesn't exist.
// However if you don't have a notFound when navigating http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit
// You'll immediately see error.tsx kicks in because
// this is a child route of /invoices where error.tsx is defined.

// also notFound will take precedence over error.tsx, 
// so you can reach out for it when you want to handle more specific errors!
// this means that when you have a notfound error handling for that specific route, 
// the not-found.tsx will take precedence over the error.tsx

// global-error.js
// to specifically handle error in root layout.js
// An error.js boundary will not handle errors thrown in a layout.js component in the same segment because the error boundary is nested inside that layouts component.
// To handle errors for a specific layout, place an error.js file in the layouts parent segment.
// To handle errors within the root layout or template, use a variation of error.js called app/global-error.js.
 
import { useEffect } from 'react';
 
// It accepts two props
export default function Error({
  // This object is an instance of JavaScript's native Error object.
  error,
  // This is a function to reset the error boundary. 
  // When executed, the function will try to re-render the route segment.
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          // this will re render the route you were on, so if the error is a 404,
          // this won't work you will need to create a not-found for that specific error 
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}