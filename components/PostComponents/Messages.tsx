import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useState } from 'react';
import { Comment } from '../../types';

async function postComment(id: string, comment: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'POST',
    body: comment,
  });
  await Router.push(`/p/${id}`);
}

async function postReply(
  id: string,
  comment: string,
  commentId: string
): Promise<void> {
  const body = { comment, commentId };
  await fetch(`/api/comment/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  await Router.push(`/p/${id}`);
}

export const Messages: React.FC<{ comments: Comment[]; id: string }> = ({
  comments,
  id,
}) => {
  const [selectedComment, setSelectedComment] = useState('');
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');

  const { data: session, status } = useSession();
  const userHasValidSession = Boolean(session);

  const handlePostReply = async (
    id: string,
    reply: string,
    commentId: string
  ) => {
    if (!reply) return;
    await postReply(id, reply, commentId);
    setReply('');
    setComment('');
    setSelectedComment('');
  };
  const handlePostComment = async (id: string, comment: string) => {
    if (!comment) return;
    await postComment(id, comment);
    setReply('');
    setComment('');
    setSelectedComment('');
  };
  const handleCommentSelect = (id: string) => {
    if (selectedComment && id === selectedComment) {
      setSelectedComment('');
    } else {
      setSelectedComment(id);
      setReply('');
    }
  };

  return (
    <>
      {comments?.map((com) => (
        <div>
          <div className="flex items-center justify-between mx-5 my-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <a
                href="#"
                className="mr-2 font-bold"
              >
                {com?.author?.name}:
              </a>
              <p>{com?.content}</p>
            </div>
            <div>
              <button
                onClick={() => handleCommentSelect(com.id)}
                className="text-blue-500 text-sm"
              >
                Vasta
              </button>
              <button className="text-red-500 ml-2 text-sm">Teavita</button>
            </div>
          </div>
          {com.replies.map((reply) => (
            <div className="flex items-center justify-between mx-5 my-2">
              <div className="flex items-center">
                <a
                  href="#"
                  className="mr-2 ml-10 font-bold"
                >
                  {reply.author?.name}:
                </a>
                <p>{reply.content}</p>
              </div>
            </div>
          ))}
          {com.id === selectedComment && (
            <div className="flex gap-4">
              <input
                type={'text'}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="border rounded-md w-full p-2 break-words"
                placeholder="Vasta..."
              />
              <button
                onClick={() => handlePostReply(id, reply, com.id)}
                className=" text-white bg-blue-500 px-5 rounded-md"
              >
                Vasta
              </button>
            </div>
          )}
        </div>
      ))}
      <div>
        <div className="flex gap-4 my-5">
          <input
            type={'text'}
            className="border rounded-md w-full p-2 break-words"
            disabled={!userHasValidSession}
            placeholder={
              !userHasValidSession
                ? 'Kommenteerimiseks logi sisse'
                : 'Küsi midagi...'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            max={250}
          />
          <button
            disabled={!comment || !userHasValidSession}
            onClick={() => handlePostComment(id, comment)}
            className="bg-blue-500 text-white rounded-md  px-7 appearance-none "
          >
            Postita
          </button>
        </div>
      </div>
    </>
  );
};
