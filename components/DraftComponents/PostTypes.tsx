export const typeValues = [
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
  const handleSelect = (e) => {
    const value = e.target.value;
    setObj({ ...obj, [e.target.name]: value });
  };
  return (
    <select
      onChange={handleSelect}
      name="type"
      id="type"
      className="block  py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
    >
      <option
        value=""
        className="text-gray-500"
      >
        -
      </option>
      {typeValues.map((type) => (
        <option
          selected={type === 'müük'}
          key={type}
          value={type}
          className="text-gray-500"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default PostTypes;
