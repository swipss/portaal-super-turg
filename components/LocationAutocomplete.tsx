import React, { ReactNode, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { IPostData } from './AccountComponents/CreatePostModal';

export const LocationAutocomplete: React.FC<{
  postData: IPostData;
  setPostData: React.Dispatch<React.SetStateAction<IPostData>>;
}> = ({ postData, setPostData }) => {
  const handleAddressSelect = async (value: string): Promise<void> => {
    setPostData({ ...postData, location: value });
  };

  return (
    <PlacesAutocomplete
      value={postData?.location ?? ''}
      onChange={(value: string) =>
        setPostData({ ...postData, location: value })
      }
      onSelect={handleAddressSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Alusta aadressi kirjutamisega...',
            })}
            className="w-full border-2 border-gray-300 p-2 rounded-md"
          />

          <div>
            {loading ? <div>...otsin</div> : null}

            {suggestions.map((suggestion) => {
              const style = {
                backgroundColor: suggestion.active ? '#ccc' : '#fff',
              };

              return (
                <div
                  {...getSuggestionItemProps(suggestion, { style })}
                  key={suggestion.description}
                >
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};
