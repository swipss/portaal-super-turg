import { Rating } from '@mui/material';
import { TiStar } from 'react-icons/ti';

export const colors = {
  0: 'bg-red-500',
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500',
};
const ConditionRating: React.FC<{ conditionRating: number }> = ({
  conditionRating,
}) => {
  return (
    <div className="flex items-center gap-2 mx-auto w-max">
      <p className="title">Seisukord</p>
      <span
        className={`font-bold flex items-center justify-center w-10 h-10 rounded shadow ${colors[conditionRating]}`}
      >
        {conditionRating}
      </span>
    </div>
  );
};

export default ConditionRating;
