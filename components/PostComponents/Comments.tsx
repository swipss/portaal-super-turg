import moment from 'moment';
import { ChangeEvent, useState } from 'react';
import { trpc } from '../../utils/trpc';

const Comment = ({
  comments,
  parentId = null,
  level = 0,
  post,
  handleSelectReply,
  selectedComment,
  session,
  newReply,
  handleReplyChange,
  handleSubmitReply,
  isLoading,
  deleteComment,
}) => {
  const children = comments
    .filter((item) => item.parent_comment_id === parentId)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA < dateB ? 1 : -1;
    });

  if (!children.length) return null;
  return (
    <>
      {children?.map((child) => (
        <div className={`w-full my-2  ${level > 0 && 'pl-14'}`}>
          <div className="relative flex items-start gap-2 ">
            <div className="relative flex-shrink-0">
              <img
                src={child.author?.image}
                className="flex-shrink-0 w-10 h-10 rounded-full "
              />
            </div>
            <div>
              <div className="px-3 py-2 bg-gray-100 rounded">
                <strong>{child.author?.name}</strong>
                {post?.author?.email === child.author?.email && (
                  <span className="ml-1 bg-blue-100 px-2.5 py-0 rounded text-blue-800 font-medium text-sm">
                    Kuulutaja
                  </span>
                )}
                {(post.author?.email === session?.user?.email ||
                  child.author?.email === session?.user?.email) && (
                  <button
                    disabled={isLoading}
                    onClick={() => deleteComment(child.id)}
                    className={` ${
                      isLoading && 'opacity-50'
                    } text-xs ml-2 text-red-400  `}
                  >
                    Kustuta
                  </button>
                )}
                <p>{child.content}</p>
              </div>
              <button
                onClick={() => handleSelectReply(child.id)}
                className="text-sm font-bold text-gray-400 "
              >
                Vasta
              </button>
              <p className="inline-block ml-1 text-sm text-gray-400">
                {moment(child.createdAt).format('DD.MM h:mm')} (
                {moment(child.createdAt).fromNow()})
              </p>
            </div>
          </div>
          {selectedComment === child.id && (
            <form
              className="flex w-full gap-1"
              onSubmit={handleSubmitReply}
            >
              <input
                onChange={(e) => handleReplyChange(e, child.id)}
                disabled={isLoading}
                autoFocus
                value={newReply.content}
                type={'text'}
                className="w-full h-10 px-3 py-2 bg-gray-100 rounded"
                placeholder={`${
                  !session
                    ? 'Kommenteerimiseks logi sisse'
                    : `Vasta kasutajale ${child.author?.name}`
                } `}
              />
              <button
                disabled={isLoading || !newReply.content || !session}
                type="submit"
                className={`${
                  !newReply?.content && 'w-0 px-0'
                } text-white transition-all overflow-hidden  duration-100 bg-blue-500 button hover:bg-blue-600 disabled:opacity-50 disabled:hover-none`}
              >
                Vasta
              </button>
            </form>
          )}
          <Comment
            comments={comments}
            parentId={child.id}
            level={level + 1}
            post={post}
            handleSelectReply={handleSelectReply}
            session={session}
            handleReplyChange={handleReplyChange}
            handleSubmitReply={handleSubmitReply}
            newReply={newReply}
            selectedComment={selectedComment}
            isLoading={isLoading}
            deleteComment={deleteComment}
          />
        </div>
      ))}
    </>
  );
};

const Comments = ({ postComments, session, post }) => {
  const [comments, setComments] = useState(postComments);
  const [selectedComment, setSelectedComment] = useState('');

  const [newReply, setNewReply] = useState<any>({});
  const [newComment, setNewComment] = useState<any>({});

  const [isLoading, setIsLoading] = useState(false);

  const createNewMutation = trpc.post.postComment.useMutation();
  const deleteMutation = trpc.post.deleteComment.useMutation();

  const handleSelectReply = (id) => {
    setNewReply({});
    setSelectedComment(id);
  };

  const handleReplyChange = (
    e: ChangeEvent<HTMLInputElement>,
    commentId = null
  ) => {
    setNewReply({
      content: e.target.value,
      parent_comment_id: commentId,
      author: session?.user?.email,
      postId: post.id,
    });
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    setIsLoading(true);
    createNewMutation.mutate(newReply, {
      onSuccess: (response) => {
        setComments([...comments, response]);
        setIsLoading(false);
        setSelectedComment('');
        setNewReply({});
      },
    });
  };

  const handleNewCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewComment({
      content: e.target.value,
      parent_comment_id: null,
      author: session?.user?.email,
      postId: post.id,
    });
  };

  const handleSubmitNewComment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    createNewMutation.mutate(newComment, {
      onSuccess: (response) => {
        setComments([...comments, response]);
        setIsLoading(false);
        setNewComment({});
      },
    });
  };

  const deleteComment = (id) => {
    setIsLoading(true);
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          const newComments = comments.filter((item) => item.id !== id);
          setComments(newComments);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <>
      <form
        className="flex w-full gap-1"
        onSubmit={handleSubmitNewComment}
      >
        <input
          onChange={(e) => handleNewCommentChange(e)}
          disabled={isLoading}
          value={newComment.content ?? ''}
          type={'text'}
          className="w-full h-10 px-3 py-2 bg-gray-100 rounded"
          placeholder={`${
            !session ? 'Kommenteerimiseks logi sisse' : `Küsi midagi...`
          } `}
        />
        <button
          disabled={isLoading || !newComment.content}
          type="submit"
          className={`${
            !newComment?.content && 'w-0 px-0'
          } text-white bg-blue-500 button overflow-hidden  transition-all duration-200 block  hover:bg-blue-600 disabled:opacity-50 disabled:hover-none`}
        >
          Vasta
        </button>
      </form>
      <Comment
        comments={comments}
        newReply={newReply}
        post={post}
        session={session}
        selectedComment={selectedComment}
        handleSelectReply={handleSelectReply}
        handleReplyChange={handleReplyChange}
        handleSubmitReply={handleSubmitReply}
        isLoading={isLoading}
        deleteComment={deleteComment}
      />
    </>
  );
};

export default Comments;
