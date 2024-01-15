'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {

  // As a general rule, if you want to read the params from the client, use the useSearchParams() hook,
  // as this avoids having to go back to the server.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // console.log(searchParams);
  // console.log(pathname);
  

  // Perform a client-side navigation to the provided route
  // If you need to programmatically redirect the user after a certain event in a Client Component, you can use the useRouter hook.
  const { replace } = useRouter();

  // This function will wrap the contents of handleSearch, 
  // and only run the code after a specific time once the user has stopped typing (300ms).
  // everytime you type a letter in, it will automatically call the handle search and query the database
  // This isn't a problem as our application is small,
  // but if our app had thousands of user each send a new request to our database
  // Debouncing is a programming practice that limits the rate at which a function can fire. 
  // In our case, you only want to query the database when the user has stopped typing.
  const handleSearch = useDebouncedCallback((term: string) => {
    // console.log(`Searching... ${term}`);

    // URLSearchParams defines utility methods to work with the query string of a URL
    // the only to read a param in the is to use a method from the URLSearchParams
    const params = new URLSearchParams(searchParams);
    // console.log(params);
    
    // to always make sure the use is in page 1 when searching
    params.set('page', '1');
    if (term) {
      // URLSearchParams.append()
      // Appends a specified key/value pair as a new search parameter.

      // set() Sets the value associated with a given search parameter to the given value. 
      // If there are several values, the others are deleted.
      params.set('query', term);
    } else {
      // Deletes search parameters that match a name, and optional value, from the list of all search parameters.
      params.delete('query');
    }
    // Perform a client-side navigation to the provided route
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={e => handleSearch(e.target.value) }
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
