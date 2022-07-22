import React, {useCallback, useEffect, useState} from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'
import {Image} from 'cloudinary-react'
import prisma from '../lib/prisma'
import { useDropzone } from 'react-dropzone'


const Draft: React.FC = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [price, setPrice] = useState<number>()
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [imagesData, setImagesData] = useState([])
    const [uploadedFiles, setUploadedFiles] = useState([])

    const isFormFilled = () => {
      if (!title || !price || !location || !content || !imagesData.length) {
        return false
      } else {
        return true
      }
    }
    console.log(isFormFilled())

    const onDrop = useCallback((acceptedFiles) => {
      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`
      
      acceptedFiles.forEach(async (acceptedFile) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', acceptedFile)
        formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET)
        
        const response = await fetch(url, {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        setUploadedFiles(old => [...old, data])
        setImagesData(old => [...old, {
          secureUrl: data.secure_url,
          publicId: data.public_id,
          format: data.format,
          version: data.version.toString()
        }])
        setLoading(false)
      })
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: true,
      // accept: {
      //   'image/*': ['.png', '.jpeg', 'jpg']
      // }
    })

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
                <p className='text-sm text-red-500'>Kohustuslikud väljad on märgitud *-ga</p>
                <input
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pealkiri*"
                type={"text"}
                value={title}
                />
                <input
                autoFocus
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Hind*"
                type={"number"}
                min={0}
                value={price}
                />
                <input
                autoFocus
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Asukoht*"
                type={"text"}
                value={location}
                />
                <textarea 
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Kirjeldus*"
                rows={8}
                value={content}
                />
                
                {/* DROP ZONE */}
                  <div {...getRootProps()} className={`flex items-center justify-center p-5 border-2 border-dashed ${isDragActive ? 'border-blue-500' : 'border-gray-300'} flex justify-center items-center text-2xl cursor-pointer`}>
                    <input {...getInputProps()} />
                    <p className='text-center text-lg text-gray-500'>Lohista pildid või vajuta üleslaadimiseks*</p>
                  </div>
                  <div className='w-11/12 overflow-y-hidden mt-5 mx-2'>
                      {loading && <p>Laen...</p>}
                    <ul className='flex gap-1 w-max'>
                      {uploadedFiles.map(file => (
                        <li key={file.public_id}>
                          <Image
                            className="h-32 object-cover"
                            cloudName={process.env.NEXT_PUBLIC_CLOUD_NAME}
                            publicId={file.public_id}
                            width="125"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>

                <input disabled={!isFormFilled()} type="submit" value={"Postita"} className={`bg-[#ececec] ${isFormFilled() && 'hover:bg-gray-300 cursor-pointer'}  px-7 py-5 rounded-md`} />
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
