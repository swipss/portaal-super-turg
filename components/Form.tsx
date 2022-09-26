import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsFilterLeft } from 'react-icons/bs';
import { AiOutlineArrowRight } from 'react-icons/ai';

const menuItems = [
  {
    title: 'Kinnisvara',
    submenu: [
      {
        title: 'Korter',
      },
      {
        title: 'Maja',
      },
      {
        title: 'Majaosa',
      },
      {
        title: 'Äripind',
        submenu: [
          {
            title: 'Büroo',
          },
          {
            title: 'Kaubanduspind',
          },
          {
            title: 'Teeninduspind',
          },
          {
            title: 'Tootmispind',
          },
        ],
      },
      {
        title: 'Garaaž',
      },
      {
        title: 'Krunt',
      },
      {
        title: 'Metsamaa',
      },
    ],
  },
  {
    title: 'Sõiduk',
  },
  {
    title: 'Kodu ja aed',
  },
  {
    title: 'Ehitus ja remont',
  },
  {
    title: 'Elektroonika',
  },
  {
    title: 'Garderoob',
  },
  {
    title: 'Lastekaubad',
  },
  {
    title: 'Vabaaeg',
  },
];

const MenuItems = ({ items, depthLevel, setCategory }) => {
  const [dropdown, setDropdown] = useState(false);
  let ref: any = useRef();
  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdown]);

  return (
    <li
      className={`border ${
        dropdown ? 'bg-blue-500 text-white' : 'bg-white text-black'
      } p-3 rounded-md  `}
      ref={ref}
    >
      {items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => {
              setDropdown((prev) => !prev);
              setCategory(items.title);
            }}
          >
            {items.title} {depthLevel > 0 ? <span>&raquo;</span> : <span />}
          </button>

          <Dropdown
            submenus={items.submenu}
            dropdown={dropdown}
            depthLevel={depthLevel}
            setCategory={setCategory}
          />
        </>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={dropdown ? 'true' : 'false'}
          onClick={() => {
            setDropdown((prev) => !prev);
            setCategory(items.title);
          }}
        >
          {items.title}{' '}
        </button>
      )}
    </li>
  );
};

const Dropdown = ({ submenus, dropdown, depthLevel, setCategory }) => {
  depthLevel = depthLevel + 1;

  return (
    <ul
      className={`${
        dropdown
          ? 'flex absolute left-0 mt-6 z-10 gap-1 bg-white p-3 w-full shadow-md border-y'
          : 'hidden'
      }`}
    >
      {submenus.map((submenu, index) => (
        <MenuItems
          items={submenu}
          key={index}
          depthLevel={depthLevel}
          setCategory={setCategory}
        />
      ))}
    </ul>
  );
};

const Form: React.FC = () => {
  const [category, setCategory] = useState('');
  const [dropdown, setDropdown] = useState(false);
  console.log(category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    Router.push(
      `/search?title=${e.target.title.value}&location=${e.target.location.value}&minPrice=${e.target.minPrice.value}&maxPrice=${e.target.maxPrice.value}&category=${category}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="get"
      className="my-5 flex flex-col gap-3 max-w-[500px] mx-auto relative "
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
      <div className="border px-4 py-2   rounded-full shadow-md flex gap-2 mx-2">
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
          className="bg-blue-500  rounded-full w-12 flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:opacity-50"
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
        } w-[490px] mx-auto  flex gap-5 flex-col border  p-4 shadow-md  rounded-xl absolute bg-white top-16 left-0 right-0 z-10`}
      >
        <input
          type="text"
          id="location"
          placeholder="Asukoht"
          name="location"
          className="border  p-2 rounded-lg "
        />
        <input
          type={'number'}
          id="minPrice"
          placeholder="Min hind"
          name="minPrice"
          className="border  p-2 rounded-lg "
        />
        <input
          type={'number'}
          id="maxPrice"
          placeholder="Max hind"
          name="maxPrice"
          className="border  p-2 rounded-lg "
        />
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

export default Form;
