import React, { useEffect, useState } from "react"

const defaultCategories = [
    {
        name: 'kinnisvara',
        category: 'kinnisvara',
        subcategories: [
            {
                name: 'korter'
            },
            {
                name: 'maja'
            },
            {
                name: 'majaosa'
            },
            {
                name: 'äripind',
                subcategories: [
                    {
                        name: 'byroo'
                    },
                    {
                        name: 'kaubanduspind'
                    },
                    {
                        name: 'teeninduspind'
                    },
                    {
                        name: 'tootmispind'
                    },
                ]
            },
            {
                name: 'garaaz'
            },
        ]
    },
    { name: "kinnisvara", category: 'kinnisvara'},
    { name: "sõiduk", category: 'sõiduk'},
    { name: "kodu", category: 'kodu'},
    { name: "aed ja õu", category: 'aed ja õu'},
    { name: "ehitus ja remont", category: 'ehitus ja remont'},
    { name: "garderoob", category: 'garderoob'},
    { name: "lastekaubad", category: 'lastekaubad'},
]

const Categories: React.FC = () => {
    // categories
    // selected category
    // clickable category
    // on change change styles

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState<string>()

    useEffect(() => {
        setCategories(defaultCategories)
    })


    return (
        <div>

            <div className="flex bg-gray-100 overflow-y-hidden mt-4 border-t">
                <div className="flex justify-center align-center border-b p-2">
                    <button>Kinnisvara</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Soiduk</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Kodu</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Aed ja ou</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Ehitus ja remont</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Elektroonika</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Garderoob</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Lastekaubad</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Vaba aeg</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Varia</button>
                </div>
            </div>

            <div className="flex bg-gray-100 overflow-y-hidden mt-4 border-t">
                <div className="flex justify-center align-center border-b p-2">
                    <button>Korter</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Maja</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Majaosa</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Aripind</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Garaaz</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Krunt</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Metsamaa</button>
                </div>
            </div>

            <div className="flex bg-gray-100 overflow-y-hidden mt-4 border-t">
                <div className="flex justify-center align-center border-b p-2">
                    <button>Buroo</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Kaubanduspind</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Teeninduspind</button>
                </div>
                <div className="flex justify-center align-center border-b p-2">
                    <button>Tootmispind</button>
                </div>
            </div>

            <div className="flex items-center justify-center p-10">
                <form className="flex flex-col w-96 gap-2">
                    <div className=" ml-auto">
                        <input type={"reset"} value="Tuhista valikud" className="ml-auto text-blue-500 text-xs"/>
                        <span className="text-xs text-yellow-500"> (?)</span>
                    </div>

                    <div className="flex items-center justify-center ">
                        <label >Asukoht</label>
                        <select name="post_location" id="post_location" className="w-52 border ml-auto">
                            <option value="volvo">-koik-</option>
                            <option value="volvo">Tartu</option>
                            <option value="saab">Tallinn</option>
                            <option value="opel">Parnu</option>
                            <option value="audi">Narva</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-center">
                        <label>Kuulutuse vanus</label>
                        <select name="post_age" id="post_age" className="w-52 border ml-auto">
                            <option value="volvo">30 paeva</option>
                            <option value="saab">20 paeva</option>
                            <option value="opel">10 paeva</option>
                            <option value="audi">1 paev</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <label>Kuulutuse tuup</label>
                        <select name="post_type" id="post_type" className="w-52 border ml-auto">
                            <option value="volvo">Muuk</option>
                            <option value="saab">Muuk</option>
                            <option value="opel">Muuk</option>
                            <option value="audi">Muuk</option>
                        </select>
                    </div>

                    <div className="flex justify-between ">
                        <div>
                            <label className="mr-1">Hind</label>
                            <select name="currency" id="currency" className="border">
                                <option>EUR</option>
                                <option>USD</option>
                                <option>RUB</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-center">
                            <input type={"number"} min={0} id="min_value" name="max_value" placeholder="min" className="w-20 border"/>
                            <span className="mx-5">-</span>
                            <input type={"number"} min={1} id="max_value" name="max_value" placeholder="max" className="w-20 border"/>
                        </div>
                    </div>


                    <div className="">
                        <div>
                            <input type={"text"} placeholder="Märksona" className="p-4 text-center mr-3 w-full border-2"/>
                            <input type="submit" value="Otsi" className="bg-gray-300 w-full mt-3 py-3 hover:bg-gray-400 cursor-pointer text-2xl"/>
                        </div>
                    </div>
                </form>
            </div>
            
        </div>
    )
}

export default Categories