import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import PostTypes from '../DraftComponents/PostTypes';
import CategorySelect from './CategorySelect';

const Search: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<any>();
  const ref: any = useRef(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
        htmlFor="price"
        className="text-sm text-gray-500 "
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
