import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { trpc } from '../../utils/trpc';
import PostTypes from '../DraftComponents/PostTypes';
import CategorySelect from './CategorySelect';

const RecentSearches = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const searchHistoryString = document?.cookie
      ?.split(';')
      .find((cookie) => cookie?.includes('recentSearches='))
      ?.split('=')[1];
    const historyArray = searchHistoryString
      ? JSON.parse(searchHistoryString)
      : [];
    setSearchHistory(historyArray);
  }, []);
  const { data: user } = trpc.drafts.getUser.useQuery();

  if (user?.searches?.length) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
        <div className="text-sm text-gray-500">Viimati sisestatud: </div>
        <div className="flex flex-wrap justify-center gap-1">
          {user.searches
            .slice(-5)
            .reverse()
            .map((search) => (
              <Link href={`/otsing?title=${search}`}>
                <a className="text-sm text-blue-500 underline cursor-pointer hover:text-gray-700">
                  {search + ','}
                </a>
              </Link>
            ))}
        </div>
      </div>
    );
  } else if (searchHistory.length) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
        <div className="text-sm text-gray-500">Viimati sisestatud: </div>
        <div className="flex flex-wrap justify-center gap-1">
          {searchHistory
            .slice(-5)
            .reverse()
            .map((search) => (
              <Link href={`/otsing?title=${search}`}>
                <a className="text-sm text-blue-500 underline cursor-pointer hover:text-gray-700">
                  {search + ','}
                </a>
              </Link>
            ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const Search: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({ postAge: '30' });
  const ref: any = useRef(null);
  const { data: session } = useSession();
  const { mutate } = trpc.home.addRecentSearch.useMutation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        ('clicked outside');
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchParams({ ...searchParams, [e.target.name]: value });
  };
  console.log(searchParams);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchParams?.title) {
      if (session) {
        mutate({
          user: session.user?.email ?? '',
          searchText: searchParams?.title,
        });
      } else {
        const recentSearchString = document.cookie
          .split(';')
          .find((cookie) => cookie.includes('recentSearches='))
          ?.split('=')[1];
        let recentSearches = recentSearchString
          ? JSON.parse(recentSearchString)
          : [];
        recentSearches.push(searchParams?.title);
        const updatedRecentSearchString = JSON.stringify(recentSearches);
        document.cookie = `recentSearches=${updatedRecentSearchString}; path=/`;
      }
    }
    Router.push({
      pathname: '/otsing',
      query: searchParams,
    });
  };

  const handleAddressSelect = async (value: string): Promise<void> => {
    setSearchParams({ ...searchParams, location: value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={ref}
      className={`w-full bg-white rounded-lg box-shadow  transition-all duration-200 ease-out ${
        !isOpen ? 'h-14' : 'h-full'
      }  border overflow-hidden p-4 `}
    >
      <div className="flex items-center">
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="grey"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>

        <input
          value={searchParams?.title}
          onClick={() => setIsOpen(true)}
          name="title"
          onChange={handleChange}
          type={'text'}
          className="w-full ml-2 text-lg font-medium appearance-none text-slate-900 focus:outline-none"
          placeholder="Otsi märksõna järgi"
        />

        <button
          onClick={() => setIsOpen(false)}
          type="button"
          className={`${
            !isOpen ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
          } transition-all duration-200`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="grey"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <RecentSearches />

      <div className="pt-4">
        <CategorySelect
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
        <div className="flex items-center w-full gap-2">
          <PlacesAutocomplete
            value={searchParams?.location}
            onChange={(value: string) =>
              setSearchParams({ ...searchParams, location: value })
            }
            onSelect={handleAddressSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="w-full">
                <div className="flex items-center">
                  <svg
                    className="inline-block w-6 h-6"
                    fill="none"
                    stroke="grey"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <input
                    {...getInputProps({
                      placeholder: 'Alusta aadressi kirjutamisega...',
                    })}
                    className="w-full h-12 px-2 border-b outline-none appearance-none"
                  />
                </div>

                <div className="mt-1">
                  {loading ? <div>Otsin...</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? '#ccc' : '#fff',
                    };

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion)}
                        key={suggestion.description}
                        className="p-2 bg-white rounded hover:bg-gray-200"
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      </div>

      <div className="flex items-center w-full gap-2">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="grey"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div className="flex items-center gap-2">
          <input
            type={'number'}
            name="minPrice"
            onChange={handleChange}
            className="w-full h-12 px-2 text-center border-b outline-none appearance-none"
          />
          <span>-</span>
          <input
            name="maxPrice"
            onChange={handleChange}
            type={'number'}
            className="w-full h-12 px-2 my-2 text-center border-b outline-none appearance-none"
          />
        </div>
      </div>

      <label
        htmlFor="postAge"
        className="text-sm text-gray-500 "
      >
        Kuulutuse vanus kuni
      </label>

      <div className="flex items-center gap-2 mb-2">
        <svg
          fill="none"
          stroke="grey"
          className="w-6 h-6"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          ></path>
        </svg>
        <label
          htmlFor="postAge"
          className="sr-only"
        >
          Underline select
        </label>
        <select
          onChange={handleChange}
          name="postAge"
          id="postAge"
          className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          <option value={9999}>Puudub</option>
          {Array.from({ length: 30 }, (_, index) => index + 1).map((item) => (
            <option
              selected={item === 30}
              key={item}
              value={item}
              className="text-gray-500"
            >
              {item === 1 ? '1 päev' : `${item} päeva`}
            </option>
          ))}
        </select>
      </div>
      <label
        htmlFor="price"
        className="text-sm text-gray-500"
      >
        Tehingu tüüp
      </label>

      <PostTypes
        obj={searchParams}
        setObj={setSearchParams}
      />
      <button
        type="submit"
        className="w-full p-2 mt-2 text-white rounded bg-messenger hover:bg-blue-600"
      >
        Otsi
      </button>
    </form>
  );
};
export default Search;
