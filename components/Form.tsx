import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsFilterLeft } from 'react-icons/bs';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { getTreeDataCategories } from '../lib/getTreeDataCategories';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';

// const MenuItems = ({ items, depthLevel, setCategory }) => {
//   const [dropdown, setDropdown] = useState(false);
//   let ref: any = useRef();
//   useEffect(() => {
//     const handler = (event) => {
//       if (dropdown && ref.current && !ref.current.contains(event.target)) {
//         setDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     document.addEventListener('touchstart', handler);
//     return () => {
//       // Cleanup the event listener
//       document.removeEventListener('mousedown', handler);
//       document.removeEventListener('touchstart', handler);
//     };
//   }, [dropdown]);

//   return (
//     <li
//       className={`border ${
//         dropdown ? 'bg-blue-500 text-white' : 'bg-white text-black'
//       } p-3 rounded-md  `}
//       ref={ref}
//     >
//       {items.submenu ? (
//         <>
//           <button
//             type="button"
//             aria-haspopup="menu"
//             aria-expanded={dropdown ? 'true' : 'false'}
//             onClick={() => {
//               setDropdown((prev) => !prev);
//               setCategory(items.title);
//             }}
//           >
//             {items.title} {depthLevel > 0 ? <span>&raquo;</span> : <span />}
//           </button>

//           <Dropdown
//             submenus={items.submenu}
//             dropdown={dropdown}
//             depthLevel={depthLevel}
//             setCategory={setCategory}
//           />
//         </>
//       ) : (
//         <button
//           type="button"
//           aria-haspopup="menu"
//           aria-expanded={dropdown ? 'true' : 'false'}
//           onClick={() => {
//             setDropdown((prev) => !prev);
//             setCategory(items.title);
//           }}
//         >
//           {items.title}{' '}
//         </button>
//       )}
//     </li>
//   );
// };

// const Dropdown = ({ submenus, dropdown, depthLevel, setCategory }) => {
//   depthLevel = depthLevel + 1;

//   return (
//     <ul
//       className={`${
//         dropdown
//           ? 'flex absolute left-0 mt-6 z-10 gap-1 bg-white p-3 w-full shadow-md border-y'
//           : 'hidden'
//       }`}
//     >
//       {submenus.map((submenu, index) => (
//         <MenuItems
//           items={submenu}
//           key={index}
//           depthLevel={depthLevel}
//           setCategory={setCategory}
//         />
//       ))}
//     </ul>
//   );
// };

const Categories = ({ categoriesData, parentId = null, level = 0 }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [open, setOpen] = useState(false);
  const items = categoriesData.filter((item) => item.parentId === parentId);
  // .sort((a, b) => {
  //   return a.name < b.name ? -1 : 1;
  // });
  // console.log(selectedCategory, 'here');

  const handleCategoryClick = (item) => {
    console.log(item.name);

    if (selectedCategory === item.id && open) {
      setOpen(false);
    } else {
      setSelectedCategory(item.id);
      setOpen(true);
    }
  };

  if (!items.length) return null;

  return (
    <div className={`${level > 0 && 'absolute left-0'} flex gap-2`}>
      {items?.map((item) => (
        <div className="flex flex-col gap-2  ">
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
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Form: React.FC<any> = ({ categories }) => {
  const [category, setCategory] = useState('');
  const [dropdown, setDropdown] = useState(false);

  const [categoriesData, setCategoriesData] = useState(
    getTreeDataCategories(categories)
  );
  console.log(categoriesData, 'categories tree data');

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

      <div className="border px-4 py-2 rounded-full shadow-md flex gap-2  ">
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
        } max-w-[490px] mx-auto absolute  flex gap-5 flex-col border  p-4 shadow-md  rounded-xl  bg-white top-16 left-0 right-0 z-10`}
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
        <div className="relative overflow-scroll h-[75px]">
          <Categories categoriesData={categoriesData} />
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

export default Form;
