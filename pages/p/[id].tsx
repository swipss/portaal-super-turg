import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import Router from "next/router"
import { useSession } from "next-auth/react"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id)
    },
    include: {
      author: {
        select: {name: true, email: true}
      }
    }
  })
  return {
    props: post,
  }
}

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT'
  })
  await Router.push('/')
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE'
  })
  await Router.push('/')
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Login sisse...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }
  return (
    <Layout>
      <div>
        <h2 className="text-center font-bold text-2xl">{title}</h2>
        <p className="text-center">Postitatud {props?.author?.name || "Unknown author"} poolt</p>
        <div className="bg-gray-300 h-96 flex items-center justify-center p-2">
          <div className="flex justify-between w-full text-xl">
            <span className="cursor-pointer">{"<"}</span>
            <span>Pilt 1</span>
            <span className="cursor-pointer">{">"}</span>
          </div>
        </div>
        <p className="text-center text-blue-500 my-5">Suurenda pilti</p>
        <div className="flex gap-4">
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center">Pilt 1</div>
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center">Pilt 2</div>
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center">Pilt 3</div>
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center">Pilt 4</div>
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center">Pilt 5</div>
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center">Pilt 6</div>
          <div className="bg-gray-300 w-20 h-20 flex items-center justify-center"> Pilt 7</div>
        </div>
        
        <ReactMarkdown children={props.content} className="my-5 mx-2"/>
        <div className="flex justify-center items-center">
          <select name="currency" id="currency" className="border mr-2">
              <option>EUR</option>
              <option>USD</option>
              <option>RUB</option>
          </select>
          <p className="font-bold text-3xl">10 000.00</p>
        </div>
        <p className="text-center font-bold my-5">Tapa, Lääne-Virumaa</p>
        <hr className="mx-3"></hr>
        <div className="flex justify-between mt-5 m-5 ">
          <div className="flex flex-col">
            <span>34,5</span>
            <span>Prindi</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 ">
            <button>Muuda</button>
            <p>Kuulutus aktiivne 18.02.2018 - 02.03.2018</p>
          </div>
          <div className="flex flex-col ">
            <span>Lisa lemmikuks</span>
            <span className="text-right">Teata</span>
          </div>
        </div>

        <div className="flex">
          <div className="flex bg-gray-400 p-5">
            <p>Müüja</p>
          </div>
          <div className="flex bg-gray-300 p-5">
            <p>Küsimused</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mx-5 my-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <a href="#" className="mr-2">Username</a>
              <p>Tere, miks te nii odavalt müüte?</p>
            </div>
            <span className="text-red-500 font-bold">!</span>
          </div>
          <div className="flex items-center justify-between mx-5 my-2">
            <div className="flex items-center">
              <a href="#" className="mr-2 ml-10 font-bold">Vastus:</a>
              <p>Tere, miks te nii odavalt müüte?</p>
            </div>
            <span className="text-red-500 font-bold">!</span>
          </div>
          <div className="flex items-center justify-between mx-5 my-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <a href="#" className="mr-2">Username2</a>
              <p>Sama küsimus...</p>
            </div>
            <span className="text-red-500 font-bold">!</span>
          </div>
        </div>
        <p className="text-right mr-5 text-blue-600 text-xs">Salvesta kuulutuse kõvatõmmis</p>
        <div className="bg-blue-600 flex items-center justify-center gap-5 p-2">
          <p className="text-white hover:text-gray-300 cursor-pointer">Reklaam</p>
          <p className="text-white hover:text-gray-300 cursor-pointer">Tingimused</p>
          <p className="text-white hover:text-gray-300 cursor-pointer">Kontakt</p>
        </div>
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Avalda</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Kustuta</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post
