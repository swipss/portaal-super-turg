import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { Image } from 'cloudinary-react';
import { useDropzone } from 'react-dropzone';
import PlacesAutocomplete from 'react-places-autocomplete';
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import { Category } from '../components/Post';

export const getStaticProps: GetStaticProps = async () => {
  const categories = await prisma.category.findMany();
  return {
    props: {
      categories,
    },
  };
};

export type Props = {
  categories: Category[];
};

const Draft: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  console.log(categoryId);

  const [address, setAddress] = useState('');

  const isFormFilled = () => {
    if (
      !title ||
      !price ||
      !address ||
      !content ||
      !imagesData.length ||
      !categoryId
    ) {
      return false;
    } else {
      return true;
    }
  };
  console.log(uploadedFiles);
  const onDrop = useCallback((acceptedFiles) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

    acceptedFiles.forEach(async (acceptedFile) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', acceptedFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadedFiles((old) => [...old, data]);
      setImagesData((old) => [
        ...old,
        {
          secureUrl: data.secure_url,
          publicId: data.public_id,
          format: data.format,
          version: data.version.toString(),
        },
      ]);
      setLoading(false);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    // accept: {
    //   'image/*': ['.png', '.jpeg', 'jpg']
    // }
  });

  const submitData = async (e): Promise<void> => {
    e.preventDefault();

    try {
      const body = { title, content, price, address, imagesData, categoryId };
      const result: Response = await fetch('api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const response = await result.json();
      console.log(response);

      Router.push('/drafts');
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressSelect = async (value: string): Promise<void> => {
    setAddress(value);
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>Uus kuulutus</h1>
          <p className="text-sm text-red-500">
            Kohustuslikud väljad on märgitud *-ga
          </p>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Pealkiri*"
            type={'text'}
            value={title}
          />
          <input
            autoFocus
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Hind*"
            type={'number'}
            min={0}
            value={price}
          />
          <select
            id="category"
            name="category"
            className="border-2 w-full p-2 rounded-md border-gray-300"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option
              value=""
              disabled
              selected
            >
              Kategooria
            </option>
            {props?.categories?.map((category) => (
              <option value={category.id}>{category.name}</option>
            ))}
          </select>

          {/* PLACES API */}
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
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
                    placeholder: 'Alusta aadressi kirjutamisega...',
                  })}
                />

                <div>
                  {loading ? <div>...loading</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? '#ccc' : '#fff',
                    };

                    return (
                      <div {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Kirjeldus*"
            rows={8}
            value={content}
          />

          {/* DROP ZONE */}
          <div
            {...getRootProps()}
            className={`flex items-center justify-center p-5 border-2 border-dashed ${
              isDragActive ? 'border-blue-500' : 'border-gray-300'
            } flex justify-center items-center text-2xl cursor-pointer`}
          >
            <input {...getInputProps()} />
            <p className="text-center text-lg text-gray-500">
              Lohista pildid või vajuta üleslaadimiseks*
            </p>
          </div>
          {loading && <p>Laen...</p>}
          <ul className="flex flex-wrap  gap-1 w-full ml-10 mt-5">
            {uploadedFiles.map((file) => (
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

          <input
            disabled={!isFormFilled()}
            type="submit"
            value={'Postita'}
            className={`bg-[#ececec] ${
              isFormFilled()
                ? 'hover:bg-blue-600 cursor-pointer bg-blue-500 text-white opacity-100'
                : 'opacity-50'
            } my-5 px-7 py-3 text-gray-white bg-blue-500 shadow-md text-white rounded-md`}
          />
          <a
            className="ml-5 text-red-500"
            href="#"
            onClick={() => Router.push('/')}
          >
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
  );
};

export default Draft;
