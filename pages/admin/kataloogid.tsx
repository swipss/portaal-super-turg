import { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import Spinner from '../../components/Layouts/Spinner';
import { trpc } from '../../utils/trpc';
import Unauthorized from '../unauthorized';

const Category = ({
  categories,
  parentId = null,
  depth,
  setIsModalOpen,
  setnewCategoryParentId,
  newCategoryParentId,
  setNewCategoryName,
  newCategoryName,
  handleNewCategoryModal,
  handleDeleteCategory,
}) => {
  const children = categories.filter((c) => c.parentId === parentId);
  if (!children.length) return null;
  return (
    <>
      {children.map((child) => (
        <>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <button
                onClick={() => handleDeleteCategory(child.id)}
                className="px-1 mr-1 text-red-400 rounded hover:bg-red-50"
              >
                x
              </button>
              {child.name}
              <button
                onClick={() => handleNewCategoryModal(child.name, child.id)}
                className="px-2 ml-1 border rounded-md hover:bg-gray-100"
              >
                Lisa
              </button>
            </th>
            <Category
              setNewCategoryName={setNewCategoryName}
              newCategoryName={newCategoryName}
              setnewCategoryParentId={setnewCategoryParentId}
              newCategoryParentId={newCategoryParentId}
              setIsModalOpen={setIsModalOpen}
              categories={categories}
              parentId={child.id}
              depth={(depth += 1)}
              handleNewCategoryModal={handleNewCategoryModal}
              handleDeleteCategory={handleDeleteCategory}
            />
          </tr>
        </>
      ))}
    </>
  );
};

const NewCategoryModal = ({
  setIsModalOpen,
  parentCategoryName,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  isLoading,
}) => {
  return (
    <div className="fixed left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto top-40">
      <div className="relative h-full max-w-[300px] mx-auto">
        <div className="relative w-full bg-white rounded-lg shadow ">
          <button
            onClick={() => setIsModalOpen(false)}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900">
              Lisa uus kategooria
            </h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Kategooria nimi
                </label>
                <input
                  name="reason"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  type="text"
                  id="reason"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <h2 className="block mb-2 text-sm font-medium text-gray-900 ">
                  Peakategooria: {parentCategoryName}
                </h2>
              </div>

              <button
                type="submit"
                onClick={(e) => handleAddCategory(e)}
                disabled={isLoading}
                className="disabled:opacity-50 w-full items-center justify-center flex gap-1 text-white bg-messenger hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Lisa
                {isLoading && <Spinner />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const CatalogsPage = () => {
  const { data: user } = trpc.drafts.getUser.useQuery();
  const { data: categories, refetch } = trpc.post.getCategories.useQuery();
  const addCategory = trpc.admin.addCategory.useMutation();
  const deleteCategory = trpc.admin.deleteCategory.useMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryParentId, setNewCategoryParentId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentCategoryName, setParentCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  let depth = 0;

  const handleAddCategory = (e) => {
    e.preventDefault();
    setIsLoading(true);
    addCategory.mutate(
      { parentId: newCategoryParentId, name: newCategoryName },
      {
        onSuccess: () => {
          refetch();
          setIsModalOpen(false);
          setIsLoading(false);
        },
      }
    );
  };

  const handleNewCategoryModal = (parentName, parentId) => {
    setIsModalOpen(true);
    setParentCategoryName(parentName);
    setNewCategoryParentId(parentId);
  };

  const handleDeleteCategory = (id) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Unauthorized>
        <h1>Sul puuduvaid õigused lehe kuvamiseks</h1>
      </Unauthorized>
    );
  }

  return (
    <>
      <Layout>
        <div className="relative overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Peakategooria
                </th>
              </tr>
            </thead>
            <tbody>
              <Category
                newCategoryParentId={newCategoryParentId}
                setnewCategoryParentId={setNewCategoryParentId}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                categories={categories}
                depth={depth}
                setIsModalOpen={setIsModalOpen}
                handleNewCategoryModal={handleNewCategoryModal}
                handleDeleteCategory={handleDeleteCategory}
              />
              <button
                onClick={() => handleNewCategoryModal('', null)}
                className="px-2 my-2 ml-4 font-medium text-black border rounded-md hover:bg-gray-100"
              >
                Lisa
              </button>
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <NewCategoryModal
            setIsModalOpen={setIsModalOpen}
            parentCategoryName={parentCategoryName}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
            isLoading={isLoading}
          />
        )}
      </Layout>
    </>
  );
};

export default CatalogsPage;
