import Router from "next/router";
import { useEffect, useRef, useState } from "react";

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
          ]
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
  let ref = useRef()
  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
      setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);
  
  
  return (
    <li className={`border ${dropdown ? 'bg-blue-500 text-white' : 'bg-white text-black'} p-3 rounded-md  `} ref={ref} >
      {items.submenu ? (
        <>
        
          <button type="button" aria-haspopup="menu"
          aria-expanded={dropdown ? "true" : "false"}
            onClick={() => {
                setDropdown((prev) => !prev)
                setCategory(items.title)
          }}
          >
            {items.title}{' '}
            {depthLevel > 0 ? <span>&raquo;</span> : <span />}
          </button>
          
                  <Dropdown submenus={items.submenu} dropdown={dropdown} depthLevel={depthLevel} setCategory={setCategory} />

          

        </>
          ) : (
                  <button type="button" aria-haspopup="menu"
          aria-expanded={dropdown ? "true" : "false"}
            onClick={() => {
                setDropdown((prev) => !prev)
                setCategory(items.title)
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
    <ul className={`${dropdown ? "flex absolute left-0 mt-6 z-10 gap-1 bg-white p-3 w-full shadow-md border-y" : "hidden"}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} setCategory={setCategory}/>
      ))}
    </ul>
  );
};

const Form: React.FC = () => {
    const [category, setCategory] = useState('')
    console.log(category)

    const handleSubmit = async (e) => {
        e.preventDefault()
        Router.push(`/feed?title=${e.target.title.value}&location=${e.target.location.value}&minPrice=${e.target.minPrice.value}&maxPrice=${e.target.maxPrice.value}&category=${category}`)
    }

    return (
        <form onSubmit={handleSubmit} method="get" className="my-5 ">
            <ul className="flex relative my-3 gap-1 ">
                {menuItems.map((menu, index) => {
                const depthLevel = 0
                    return <MenuItems items={menu} key={index} depthLevel={depthLevel} setCategory={setCategory} />;
            })}
            </ul>
            <input type="text" id="title" placeholder="Märksõna" name="title" className="border p-2 rounded-md "/>
            <input type="text" id="location" placeholder="Asukoht" name="location" className="border mx-2 p-2 rounded-md "/>
            <input type={"number"} id="minPrice" placeholder="Min hind" name="minPrice" className="border mx-2 p-2 rounded-md " />
            <input type={"number"} id="maxPrice" placeholder="Max hind" name="maxPrice" className="border mx-2 p-2 rounded-md "/>
            <button type="submit" className="px-6 bg-blue-500 text-white rounded-md py-2 mx-2 hover:bg-blue-600 focus:bg-blue-600">Otsi</button>
        </form>
    )
}

export default Form