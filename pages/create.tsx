import React, {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'
import prisma from '../lib/prisma'


const Draft: React.FC = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [price, setPrice] = useState(0)
    const [location, setLocation] = useState('')

    const [loading, setLoading] = useState(false)
    
    const [images, setImages] = useState([])
    const [imagesData, setImagesData] = useState([])

    
    // console.log(images)
    

    const uploadImage = async (e) => {
      const files = e.target.files
      const data = new FormData()
      data.append('file', files[0])
      data.append('upload_preset', 'portaal')
      setLoading(true)
      

      const res = await fetch('https://api.cloudinary.com/v1_1/dva859ust/image/upload',{
        method: "POST",
        body: data
      })
      const file = await res.json()
      setImages([...images, file.secure_url])
      setImagesData([...imagesData, {
        secureUrl: file.secure_url,
        publicId: file.public_id,
        format: file.format,
        version: file.version.toString()
      }])

      // const upload = await fetch('/api/upload', {
      //   method: "POST",
      //   body: JSON.stringify(file)
      // })
      // const uploadRes = await upload.json()
      setLoading(false)
      
    }

    const submitData = async (e) => {
        e.preventDefault()

        try {
          const body = {title, content, price, location, imagesData }
            console.log(imagesData)
            const result = await fetch('api/post', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            const response = await result.json()
            console.log(response)

            Router.push('/drafts')

        } catch (error) {
          console.log(error)
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
                <textarea 
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Kirjeldus"
                rows={8}
                value={content}
                />
                <input 
                type={"file"}
                placeholder='Upload an image'
                accept='image/*'
                onChange={uploadImage}
                />
                {images ? (
                  <div className='flex'>
                    {loading && <p>Laen...</p>}
                    {images && images?.map(image => (
                      <div key={image}>
                        <img  src={image} className="h-32"/>
                      </div>
                    ))}
                  </div>
                ): null}
                <input disabled={!title || !price || !location || !content || !images} type="submit" value={"Postita"} className="bg-[#ececec] hover:bg-gray-300 cursor-pointer px-7 py-5 rounded-md" />
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
