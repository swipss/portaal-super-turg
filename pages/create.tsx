import React, {useState} from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'

const Draft: React.FC = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [price, setPrice] = useState(0)
    const [location, setLocation] = useState('')
    const [images, setImages] = useState([])

    console.log(location, images)
    

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const body = {title, content, price, location}
            await fetch('api/post', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body),
            })
            await Router.push('/drafts')
        } catch (e) {
            console.log(e)
        }
    }

  return (
    <Layout>
        <div>
            <form onSubmit={submitData}>
                <h1>Uus kuulutus</h1>
                <input
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pealkiri"
                type={"text"}
                value={title}
                />
                <input
                autoFocus
                onChange={(e) => setPrice(parseInt(e.target.value))}
                placeholder="Summa"
                type={"number"}
                min={0}
                value={price}
                />
                <input
                autoFocus
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Asukoht"
                type={"text"}
                value={location}
                />
                <input
                type="file"
                name="image"
                min={1}
                onChange={(event) => {
                  setImages([...images, event.target.files[0]]);
                }}
                />
                {images.length ? (
                  <div className='flex gap-1 mt-2 flex-wrap'>
                    {images.map(image => (
                      <img alt={image} src={URL.createObjectURL(image)} className="w-48 h-48"/>
                    ))}
                  </div>
                ): null}
                
                <textarea 
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Kirjeldus"
                rows={8}
                value={content}
                />
                <input disabled={!content || !title || !price || !location || !images} type="submit" value={"Postita"} className="bg-[#ececec] hover:bg-gray-300 cursor-pointer px-7 py-5 rounded-md" />
                <a className="ml-5 hover:text-blue-500" href="#" onClick={() => Router.push('/')}>
                    või tühista
                </a>
            </form>
        </div>
        <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        input[type='number'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        
      `}</style>
    </Layout>
  )
}

export default Draft
