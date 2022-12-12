const typeValues = [
  'müük',
  'ost',
  'vahetus',
  'annan ära',
  'annan rendile',
  'võtan rendile',
  'pakun teenust',
  'soovin teenust',
];

const PostTypes = ({ obj, setObj }) => {
  const handleSelect = (value) => {
    setObj({ ...obj, type: value });
  };

  return (
    <div>
      {typeValues.map((value) => (
        <button
          onClick={() => handleSelect(value)}
          type="button"
          className={` px-4 py-2 m-1 text-sm font-medium text-gray-700  ${
            value === obj?.type ? 'bg-gray-200' : 'bg-gray-100'
          } rounded hover:bg-gray-200 min-w-max`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default PostTypes;
