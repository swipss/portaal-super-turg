import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsFilterLeft } from 'react-icons/bs';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { getTreeDataCategories } from '../lib/getTreeDataCategories';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';
import { LocationAutocomplete } from './LocationAutocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';

export const Categories = ({
  categoriesData,
  parentId = null,
  level = 0,
  setCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [open, setOpen] = useState(false);
  const items = categoriesData.filter((item) => item.parentId === parentId);
  // .sort((a, b) => {
  //   return a.name < b.name ? -1 : 1;
  // });

  const handleCategoryClick = (item) => {
    setCategory(item.name.toLowerCase());
    if (selectedCategory === item.id && open) {
      setOpen(false);
    } else {
      setSelectedCategory(item.id);
      setOpen(true);
    }
  };

  if (!items.length) return null;

  return (
    <div className={`flex gap-2 overflow-x-scroll`}>
      {items?.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-2  "
        >
          <button
            type="button"
            onClick={() => handleCategoryClick(item)}
            className={`${
              selectedCategory === item.id &&
              'border-none bg-blue-600 text-white'
            } 
               block w-max border py-3 px-4 text-gray-900 bg-white rounded-xl "
              `}
          >
            <div className="flex gap-2 items-center">
              {item?.name}
              {item.hasChildren && (
                <AiFillCaretRight
                  size={16}
                  color={`${selectedCategory === item.id ? 'white' : 'black'}`}
                />
              )}
            </div>
          </button>
          {selectedCategory === item.id && open && (
            <div className="flex gap-5">
              <Categories
                categoriesData={categoriesData}
                parentId={item.id}
                level={level + 1}
                setCategory={setCategory}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Search: React.FC<any> = ({ categories }) => {
  const [category, setCategory] = useState('');
  const [dropdown, setDropdown] = useState(false);

  const [categoriesData, setCategoriesData] = useState(
    getTreeDataCategories(categories)
  );

  const [location, setLocation] = useState('');

  const handleAddressSelect = async (value: string): Promise<void> => {
    setLocation(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Router.push(
      `/search?title=${e.target.title.value}&location=${location}&minPrice=${e.target.minPrice.value}&maxPrice=${e.target.maxPrice.value}&category=${category}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="get"
      className="my-5 flex flex-col gap-3 max-w-[500px] mx-auto bg-white rounded-full "
    >
      {/* <ul className="flex relative my-3 gap-1 ">
        {menuItems.map((menu, index) => {
          const depthLevel = 0;
          return (
            <MenuItems
              items={menu}
              key={index}
              depthLevel={depthLevel}
              setCategory={setCategory}
            />
          );
        })}
      </ul> */}

      <div className="border px-4 py-2 rounded-full shadow-md flex gap-2 ">
        <button
          type="button"
          onClick={() => setDropdown(!dropdown)}
        >
          <BsFilterLeft
            size={24}
            color="darkgrey"
          />
        </button>
        <input
          type="text"
          id="title"
          placeholder="Märksõna"
          className="w-full rounded-full p-2"
          name="title"
          min={5}
        />
        <button
          type="submit"
          className="bg-blue-500  rounded-full w-14 flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:opacity-50"
        >
          <AiOutlineArrowRight
            color="white"
            size={20}
          />
        </button>
      </div>

      <div
        className={`${
          !dropdown && 'hidden'
        } max-w-[1000px] absolute flex gap-5 flex-col border  p-4 shadow-md  rounded-xl  bg-white top-16 left-0 right-0 mx-auto  z-10`}
      >
        <PlacesAutocomplete
          value={location}
          onChange={(value: string) => setLocation(value)}
          onSelect={handleAddressSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Otsi asukohta...',
                })}
                className="w-full border border-gray-200 p-2 rounded-lg"
              />

              <div>
                {loading ? <div>...otsin</div> : null}

                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? '#ccc' : '#fff',
                  };

                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, { style })}
                      key={suggestion.key}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <input
          type="text"
          id="location"
          placeholder="Asukoht"
          name="location"
          className="border  p-2 rounded-lg "
        />
        <div className="flex justify-between gap-1">
          <input
            type={'number'}
            id="minPrice"
            placeholder="Min hind"
            name="minPrice"
            className="border  p-2 rounded-lg w-full"
          />
          <input
            type={'number'}
            id="maxPrice"
            placeholder="Max hind"
            name="maxPrice"
            className="border p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <Categories
            categoriesData={categoriesData}
            setCategory={setCategory}
          />
        </div>

        {/* <button
          type="submit"
          className="px-6 bg-blue-500 text-white rounded-md py-2 mx-2 hover:bg-blue-600 focus:bg-blue-600"
        >
          Otsi
        </button> */}
      </div>
    </form>
  );
};

export default Search;
