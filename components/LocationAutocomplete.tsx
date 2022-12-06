import React, { ReactNode, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export const LocationAutocomplete: React.FC<{
  postData: any;
  setPostData: any;
}> = ({ postData, setPostData }) => {
  const handleAddressSelect = async (value: string): Promise<void> => {
    setPostData({ ...postData, location: value });
  };

  return (
    <PlacesAutocomplete
      value={postData?.location}
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
            className="w-full h-10 px-3 py-2 bg-gray-200 rounded"
          />

          <div>
            {loading ? <div>...otsin</div> : null}

            {suggestions.map((suggestion) => {
              const style = {
                backgroundColor: suggestion.active ? '#ccc' : '#fff',
              };

              return (
                <div
                  {...getSuggestionItemProps(suggestion)}
                  key={suggestion.description}
                  className="p-2 rounded hover:bg-gray-200"
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
