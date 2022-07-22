import React, { useState } from "react"
import next, { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import Router from "next/router"
import { useSession } from "next-auth/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons"



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id)
    },
    include: {
      author: {
        select: {name: true, email: true}
      },
      images: {
        select: {secureUrl: true}
      },
      comments: {
        select: {
          content: true,
          replies: {
            select: {
              content: true,
              author: {
                select: {
                  name: true,
                  id: true
                }
              }
            }
          },
          id: true,
          author: {
            select: {name: true}
          },
          
        }
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

async function postComment(id: string, comment: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'POST',
    body: comment,
  })
  await Router.push(`/p/${id}`)

}

async function postReply(id: string, comment: string, commentId: string): Promise<void> {
  
  const body = {comment, commentId}
  await fetch(`/api/comment/${id}`, {
    method: 'POST',
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(body)
  })
  await Router.push(`/p/${id}`)

}

const Post: React.FC<PostProps> = (props) => {
  const [visible, setVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(props?.images?.[0])
  const [comment, setComment] = useState('')
  const [reply, setReply] = useState('')
  const [selectedComment, setSelectedComment] = useState('')
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Login sisse...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  const handlePostReply = async (id: string, reply: string, commentId: string) => {
    if (!reply) return
    await postReply(id, reply, commentId)
    setReply('')
    setComment('')
    setSelectedComment('')
  }
  const handlePostComment = async (id: string, comment: string) => {
    if (!comment) return
    await postComment(id, comment)
    setReply('')
    setComment('')
    setSelectedComment('')
  }

  const handleImageChangeForward = () => {
    let currIndex = props?.images?.indexOf(selectedImage)
    let nextIndex = currIndex + 1
    console.log(currIndex, nextIndex)
    if (!props?.images?.[nextIndex]) {
      nextIndex = 0
    }
    setSelectedImage(props?.images?.[nextIndex])
  }
  const handleImageChangeBackward = () => {
    let currIndex = props?.images?.indexOf(selectedImage) 
    let nextIndex = currIndex - 1
    console.log(currIndex, nextIndex)
    if (!props?.images?.[nextIndex]) {
      nextIndex = props?.images?.length - 1
    }
    setSelectedImage(props?.images?.[nextIndex])
  
  }

  const isImageSelected = (image) => {
    return image.secureUrl === selectedImage.secureUrl
  }

  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }
  return (
    <Layout>
      <div>
        <h2 className="text-center font-bold text-2xl my-4">{title}</h2>
        <p className="text-center my-4">Postitatud {props?.author?.name || "Unknown author"} poolt</p>
        <div className=" p-4 flex items-center justify-center ">
          <div className="relative w-full flex items-center justify-center">
              <FontAwesomeIcon onClick={() => handleImageChangeForward()} icon={faArrowRight} className="absolute right-0 text-5xl text-gray-300 cursor-pointer"/>
              <FontAwesomeIcon onClick={() => handleImageChangeForward()} icon={faArrowLeft} className="absolute left-0 text-5xl text-gray-300 cursor-pointer"/>

              <img src={selectedImage.secureUrl}  className="cursor-pointer h-96 object-cover object-center" onClick={() => setIsFullscreen(!isFullscreen)}/>

          </div>
          {isFullscreen && (
            <div className="w-screen h-full absolute inset-0" >
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="absolute cursor-pointer right-0 m-5 text-white z-20  text-2xl">X</button>
              <div>
                {props?.images?.length > 1 && (
                  <FontAwesomeIcon onClick={() => handleImageChangeForward()} icon={faArrowRight} className="cursor-pointer text-white z-20 text-5xl absolute right-0 top-2/4 mr-5 "/>
                )}
                <img onClick={() => setIsFullscreen(!isFullscreen)} src={selectedImage.secureUrl}  className={`sm:h-screen m-auto absolute object-cover object-center inset-0 opacity-100 z-10`}/>
                {props?.images?.length > 1 && (
                  <FontAwesomeIcon icon={faArrowLeft} onClick={() => handleImageChangeBackward()} className="cursor-pointer text-white z-20 text-5xl absolute  top-2/4 ml-5 "/>
                )}
              </div>
              <div className="bg-black w-fill h-full absolute inset-0 z-0" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center ">
          <div className="w-11/12 overflow-y-hidden">
            <div className="flex gap-4 ">
              {props?.images?.map(image => (
                <img onClick={() => setSelectedImage(image)} key={image.secureUrl} src={image.secureUrl} className={`${isImageSelected(image) && 'border-4 border-blue-500 '} w-20 h-20 object-cover object-center flex items-center justify-center cursor-pointer`}/>
              ))}
            
            </div>
          </div>
        </div>
        
        <ReactMarkdown children={props.content} className="my-5 mx-2"/>
        <div className="flex justify-center items-center">
          <select name="currency" id="currency" className="border mr-2">
              <option>EUR</option>
              <option>USD</option>
              <option>RUB</option>
          </select>
          <p className="font-bold text-3xl">{props.price?.toFixed(2) || '0.00'}€</p>
        </div>
        <p className="text-center font-bold my-5">{props.location}</p>
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
        {props?.comments?.map(com => (
          <div>
            <div className="flex items-center justify-between mx-5 my-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <a href="#" className="mr-2 font-bold">{com?.author?.name}:</a>
                <p>{com?.content}</p>
              </div>
              <div>
                <button onClick={() => setSelectedComment(com.id)} className="text-blue-500 text-sm">Vasta</button>
                <button className="text-red-500 text-sm">Teavita</button>
              </div>
              
            </div>
            {com.replies.map(reply => ( 
              <div className="flex items-center justify-between mx-5 my-2">
                <div className="flex items-center">
                  <a href="#" className="mr-2 ml-10 font-bold">{reply.author?.name}:</a>
                  <p>{reply.content}</p>
                </div>
              </div>
            ))}
            {com.id === selectedComment && (
              <div className="flex gap-4">
                <input 
                type={"text"}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="border rounded-md w-full p-2 break-words"
                placeholder="Vasta..."
    
                />
                <button onClick={() => handlePostReply(props.id, reply, com.id)} className=" text-white bg-blue-500 px-5 rounded-md">Vasta</button>
              </div>

            )}
            
            
          </div>
            
          
        ))}
        <div>
          <div className="flex gap-4 my-5">
            <input 
            type={"text"}
            className="border rounded-md w-full p-2 break-words"
            disabled={!userHasValidSession}
            placeholder={!userHasValidSession ? 'Kommenteerimiseks logi sisse' : 'Küsi midagi...'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            max={250}
            />
            <button disabled={!comment || !userHasValidSession} onClick={() => handlePostComment(props.id, comment)} className="bg-blue-500 text-white rounded-md  px-7 appearance-none ">Postita</button>
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

      

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post
