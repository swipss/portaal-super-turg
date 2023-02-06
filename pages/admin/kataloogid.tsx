import { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import Spinner from '../../components/Layouts/Spinner';
import { trpc } from '../../utils/trpc';
import Unauthorized from '../unauthorized';
import { AdminTabs } from './teavitused';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { Category } from '@prisma/client';

const Category = ({
  categories,
  parentId,
  depth,
  setIsModalOpen,
  setnewCategoryParentId,
  newCategoryParentId,
  setNewCategoryName,
  newCategoryName,
  handleNewCategoryModal,
  handleCategoryClick,
}) => {
  const children = categories?.filter((c) => c.parentId === parentId);
  if (!children?.length) return null;
  return (
    <>
      {children?.map((child) => (
        <tr
          className="bg-white border-b"
          key={child.id}
        >
          <th
            scope="row"
            className="px-4 py-2 font-medium text-gray-900 align-text-top whitespace-nowrap"
          >
            <span
              onClick={() => handleCategoryClick(child.name, child.id)}
              className="px-1 rounded cursor-pointer hover:bg-gray-100"
            >
              {child.name}
            </span>
          </th>
          <button
            onClick={() => handleNewCategoryModal(child.name, child.id)}
            className="px-2 ml-4 font-medium text-gray-900 border rounded-md hover:bg-gray-100"
          >
            Lisa
          </button>
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
            handleCategoryClick={handleCategoryClick}
          />
        </tr>
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
        <div className="relative w-full bg-white rounded-lg shadow">
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

const CategoryEditingModal = ({
  editableCategoryName,
  setEditableCategoryName,
  setIsEditingModalOpen,
  handleEditCategory,
  handleDeleteCategory,
  isLoading,
  setIsConfirmationModalOpen,
}) => {
  return (
    <div className="fixed left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto top-40">
      <div className="relative h-full max-w-[300px] mx-auto">
        <div className="relative w-full bg-white rounded-lg shadow">
          <button
            onClick={() => setIsEditingModalOpen(false)}
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
              Muuda kategooriat
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
                  value={editableCategoryName}
                  onChange={(e) => setEditableCategoryName(e.target.value)}
                  name="reason"
                  type="text"
                  id="reason"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsConfirmationModalOpen(true)}
                  type="button"
                  disabled={isLoading}
                  className="disabled:opacity-50 w-full text-gray-900 items-center justify-center flex gap-1 border hover:bg-red-500 hover:text-white hover:border-red-500 bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Kustuta
                </button>
                <button
                  onClick={(e) => handleEditCategory(e)}
                  type="submit"
                  disabled={isLoading}
                  className="disabled:opacity-50 w-full items-center justify-center flex gap-1 text-white bg-messenger hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Salvesta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  setIsConfirmationModalOpen,
  handleDeleteCategory,
  isLoading,
  confirmationValue,
  setConfirmationValue,
}) => {
  return (
    <div className="fixed left-0 right-0 z-[99] p-4 overflow-x-hidden overflow-y-auto top-40">
      <div className="relative h-full max-w-[300px] mx-auto">
        <div className="relative w-full bg-white rounded-lg shadow">
          <button
            onClick={() => setIsConfirmationModalOpen(false)}
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
              Kustuta kategooria
            </h3>
            <form className="space-y-6">
              <div>
                <div className="flex flex-col items-center gap-2 p-2 mb-2 text-sm text-center text-red-600 bg-red-200 rounded">
                  <AiOutlineExclamationCircle
                    size={24}
                    color="red"
                  />
                  <p>Kategooria kustutamisega kustuvad kõik alamkategooriad!</p>
                </div>
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Admin parool
                </label>
                <input
                  name="reason"
                  value={confirmationValue}
                  onChange={(e) => setConfirmationValue(e.target.value)}
                  type="text"
                  id="reason"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleDeleteCategory(e)}
                  type="button"
                  disabled={
                    confirmationValue !==
                      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || isLoading
                  }
                  className="disabled:opacity-50 w-full disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-900 text-gray-900 items-center justify-center flex gap-1 border hover:bg-red-500 hover:text-white hover:border-red-500 bg-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Kustuta
                </button>
              </div>
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
  const editCategory = trpc.admin.editCategory.useMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [newCategoryParentId, setNewCategoryParentId] = useState<string | null>(
    ''
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentCategoryName, setParentCategoryName] = useState('');
  const [editableCategoryName, setEditableCategoryName] = useState('');
  const [editableCategoryId, setEditableCategoryId] = useState('');
  const [deletableCategoryId, setDeletableCategoryId] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationValue, setConfirmationValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  let parentCategories = categories?.filter((c) => !c.parentId);

  const [selectedParentCategory, setSelectedParentCategory] = useState<
    Category | undefined
  >(parentCategories?.[0]);

  console.log(parentCategories, selectedParentCategory);

  let depth: number = 0;

  const handleAddCategory = (e: React.FormEvent) => {
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

  const handleNewCategoryModal = (
    parentName: string,
    parentId: string | null
  ) => {
    setIsModalOpen(true);
    setParentCategoryName(parentName);
    setNewCategoryParentId(parentId);
  };

  const handleDeleteCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    deleteCategory.mutate(deletableCategoryId, {
      onSuccess: () => {
        refetch();
        setIsEditingModalOpen(false);
        setIsConfirmationModalOpen(false);
        setIsLoading(false);
      },
    });
  };

  const handleCategoryClick = (name: string, id: string) => {
    setEditableCategoryName(name);
    setEditableCategoryId(id);
    setDeletableCategoryId(id);
    setIsEditingModalOpen(true);
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    editCategory.mutate(
      { id: editableCategoryId, name: editableCategoryName },
      {
        onSuccess: () => {
          refetch();
          setIsEditingModalOpen(false);
          setIsLoading(false);
        },
      }
    );
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
        <AdminTabs />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedParentCategory(undefined)}
            className={`${
              selectedParentCategory === undefined && 'bg-gray-100'
            } flex items-center justify-center px-1 text-xs  font-medium text-gray-500 border border-gray-300 rounded-lg  hover:bg-gray-100`}
          >
            Kõik
          </button>
          {parentCategories?.map((category) => (
            <button
              onClick={() => setSelectedParentCategory(category)}
              className={`${
                selectedParentCategory === category && 'bg-gray-100'
              } flex items-center justify-center w-max py-0.5  text-xs px-1 font-medium text-gray-500 border border-gray-300 rounded-lg  hover:bg-gray-100`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="relative overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3"
                >
                  Peakategooria
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedParentCategory && (
                <button
                  onClick={() =>
                    handleNewCategoryModal(
                      selectedParentCategory.name,
                      selectedParentCategory.id
                    )
                  }
                  className="px-2 ml-4 font-medium text-gray-900 border rounded-md hover:bg-gray-100"
                >
                  Lisa alamkat
                </button>
              )}
              <Category
                newCategoryParentId={newCategoryParentId}
                setnewCategoryParentId={setNewCategoryParentId}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                categories={categories}
                depth={depth}
                setIsModalOpen={setIsModalOpen}
                handleNewCategoryModal={handleNewCategoryModal}
                handleCategoryClick={handleCategoryClick}
                parentId={selectedParentCategory?.id ?? null}
              />
              <button
                onClick={() => handleNewCategoryModal('', null)}
                className="block px-2 my-2 ml-4 font-medium text-black border rounded-md hover:bg-gray-100"
              >
                Lisa uus peakategooria
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
      {isEditingModalOpen && (
        <CategoryEditingModal
          editableCategoryName={editableCategoryName}
          setIsEditingModalOpen={setIsEditingModalOpen}
          setEditableCategoryName={setEditableCategoryName}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
          isLoading={isLoading}
          setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          setIsConfirmationModalOpen={setIsConfirmationModalOpen}
          handleDeleteCategory={handleDeleteCategory}
          isLoading={isLoading}
          confirmationValue={confirmationValue}
          setConfirmationValue={setConfirmationValue}
        />
      )}
    </>
  );
};

export default CatalogsPage;
