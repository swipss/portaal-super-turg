import { NextPage } from 'next';
import Layout from '../../components/Layouts/Layout';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import Unauthorized from '../unauthorized';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

const languages = ['Eesti keel', 'Vene keel', 'Inglise keel', 'Soome keel'];
const levels = [
  {
    certified: ['C2', 'C1', 'B2', 'B1', 'A2', 'A1'],
    notCertified: ['Väga hea', 'Hea', 'Keskmine', 'Halb'],
  },
];

const Account: NextPage = () => {
  const { data: user, refetch } = trpc.drafts.getUser.useQuery();
  const { mutate: changeUsername, isLoading: isUsernameChangeLoading } =
    trpc.account.changeUsername.useMutation();
  const { mutate: changePhoneNumber, isLoading: isPhoneNumberChangeLoading } =
    trpc.account.changePhoneNumber.useMutation();
  const {
    mutate: changePhoneNumberVisibilityOnProfile,
    isLoading: isPhoneNumberVisibilityLoading,
  } = trpc.account.changePhoneNumberVisibilityOnProfile.useMutation();
  const {
    mutate: changePrimaryAddress,
    isLoading: isPrimaryAddressChangeLoading,
  } = trpc.account.changePrimaryAddress.useMutation();
  const {
    mutate: changeSecondaryAddress,
    isLoading: isSecondaryAddressChangeLoading,
  } = trpc.account.changeSecondaryAddress.useMutation();
  const {
    mutate: changePrimaryLanguage,
    isLoading: isPrimaryLanguageChangeLoading,
  } = trpc.account.changePrimaryLanguage.useMutation();
  const { mutate: addNewLanguage, isLoading: isAddingNewLanguageLoading } =
    trpc.account.addLanguage.useMutation();
  const { mutate: deleteLanguage, isLoading: isDeletingLanguageLoading } =
    trpc.account.deleteLanguage.useMutation();
  const {
    mutate: changeAdditionalInfo,
    isLoading: isAdditionalInfoChangeLoading,
  } = trpc.account.addAdditionalInfo.useMutation();
  const { mutate: addNewChannel, isLoading: isAddingNewChannelLoading } =
    trpc.account.addNewChannel.useMutation();
  const { mutate: deleteChannel, isLoading: isDeletingChannelLoading } =
    trpc.account.deleteChannel.useMutation();
  const { mutate: addNewAddress, isLoading: isAddingNewAddressLoading } =
    trpc.account.addNewAddress.useMutation();
  const { mutate: deleteAddress, isLoading: isDeletingAddressLoading } =
    trpc.account.deleteAddress.useMutation();

  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberVisibility, setPhoneNumberVisibility] = useState(
    user?.isPhoneNumberVisible
  );

  const [primaryAddress, setPrimaryAddress] = useState(user?.primaryAddress);
  const [secondaryAddress, setSecondaryAddress] = useState(
    user?.secondaryAddress
  );
  const [primaryLanguage, setPrimaryLanguage] = useState(user?.primaryLanguage);

  const [isPrimaryLanguageDropdownOpen, setIsPrimaryLanguageDropdownOpen] =
    useState(false);
  const [otherLanguages, setOtherLanguages] = useState<any>([
    user?.otherLanguages,
  ]);

  const [newLanguage, setNewLanguage] = useState<{
    language: string;
    level: string;
  }>({
    language: '',
    level: '',
  });
  const [isUserAddingNewLanguage, setIsUserAddingNewLanguage] = useState(false);
  const [isNewLanguageDropdownOpen, setIsNewLanguageDropdownOpen] =
    useState(false);
  const [isNewLanguageLevelDropdownOpen, setIsNewLanguageLevelDropdownOpen] =
    useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<
    string | null | undefined
  >(user?.additionalInfoText);
  const [socialChannels, setSocialChannels] = useState(user?.socials);
  const [isUserAddingNewChannel, setIsUserAddingNewChannel] = useState(false);
  const [newChannel, setNewChannel] = useState<any>({
    link: '',
    name: '',
  });
  const [addAddress, setAddAddress] = useState('');
  const [isUserAddingNewAddress, setIsUserAddingNewAddress] = useState(false);
  const [aadresses, setAddAddresses] = useState(user?.otherAddresses);

  useEffect(() => {
    if (username) {
      const timeout = setTimeout(() => {
        changeUsername(username);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [username]);

  useEffect(() => {
    if (phoneNumber) {
      const timeout = setTimeout(() => {
        changePhoneNumber(phoneNumber);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (primaryAddress) {
      const timeout = setTimeout(() => {
        changePrimaryAddress(primaryAddress);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [primaryAddress]);

  useEffect(() => {
    if (secondaryAddress) {
      const timeout = setTimeout(() => {
        changeSecondaryAddress(secondaryAddress);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [secondaryAddress]);

  useEffect(() => {
    if (additionalInfo) {
      const timeout = setTimeout(() => {
        changeAdditionalInfo(additionalInfo);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [additionalInfo]);
  console.log(additionalInfo);
  useEffect(() => {
    setPhoneNumberVisibility(user?.isPhoneNumberVisible);
    setPrimaryAddress(user?.primaryAddress);
    setSecondaryAddress(user?.secondaryAddress);
    setPrimaryLanguage(user?.primaryLanguage);
    setOtherLanguages(user?.otherLanguages);
    setAdditionalInfo(user?.additionalInfoText);
    setSocialChannels(user?.socials);
    setAddAddresses(user?.otherAddresses);
  }, [user]);

  const changePhoneNumberVisibility = () => {
    setPhoneNumberVisibility(!phoneNumberVisibility);
    changePhoneNumberVisibilityOnProfile(!phoneNumberVisibility, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handlePrimaryLanguageChange = (language: string) => {
    setPrimaryLanguage(language);
    changePrimaryLanguage(language);
  };

  const handleNewLanguageClick = (language: string) => {
    setNewLanguage({ ...newLanguage, language });
    setIsNewLanguageDropdownOpen(false);
  };

  const handleNewLanguageLevelClick = (level: string) => {
    setNewLanguage({ ...newLanguage, level });
    setIsNewLanguageLevelDropdownOpen(false);
  };

  const handleAddNewLanguageClick = () => {
    if (isUserAddingNewLanguage) {
      addNewLanguage(newLanguage, {
        onSuccess: () => {
          refetch();
          setIsUserAddingNewLanguage(false);
          setNewLanguage({ language: '', level: '' });
        },
      });
    } else {
      setIsUserAddingNewLanguage(true);
    }
  };

  const handleAddNewChannelClick = () => {
    if (isUserAddingNewChannel) {
      addNewChannel(newChannel, {
        onSuccess: () => {
          refetch();
          setIsUserAddingNewChannel(false);
          setNewChannel({ link: '', name: '' });
        },
      });
    } else {
      setIsUserAddingNewChannel(true);
    }
  };

  const handleAddNewChannelName = (name: string) => {
    setNewChannel({ ...newChannel, name });
  };

  const handleAddNewChannelLink = (link: string) => {
    setNewChannel({ ...newChannel, link });
  };

  const handleAddNewAddress = () => {
    if (isUserAddingNewAddress) {
      addNewAddress(addAddress, {
        onSuccess: () => {
          refetch();
          setIsUserAddingNewAddress(false);
          setAddAddress('');
        },
      });
    } else {
      setIsUserAddingNewAddress(true);
    }
  };

  // filter out the address that was clicked
  const handleDeleteAddress = (address: string) => {
    const filteredAddresses = aadresses?.filter(
      (item: string) => item !== address
    );
    setAddAddresses(filteredAddresses);
    deleteAddress(filteredAddresses!);
  };
  console.log(aadresses);

  if (!user) {
    return (
      <Unauthorized>
        <h1>Sul puuduvaid õigused lehe kuvamiseks</h1>
        <Link
          href="/api/auth/signin"
          legacyBehavior
        >
          <p className="ml-1 underline">logi sisse</p>
        </Link>
      </Unauthorized>
    );
  }
  console.log(newChannel);

  return (
    <Layout>
      <div className="flex flex-col items-center w-full gap-5">
        <Image
          src={user?.image!}
          alt="user image"
          width={170}
          height={170}
          className="rounded-full"
        />
        <h1 className="italic">{user?.email}</h1>
        <TextInput
          label={'Nimi'}
          value={username}
          onChange={setUsername}
          placeholder={user?.name}
          isSaving={isUsernameChangeLoading}
        />
        <h1 className="w-full text-left">Kontakt</h1>
        <TextInput
          label={'Telefon'}
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder={user?.phone}
          isSaving={isPhoneNumberChangeLoading}
        />
        <label className="relative inline-flex items-center w-full cursor-pointer ">
          <input
            type="checkbox"
            checked={phoneNumberVisibility}
            className="sr-only peer"
            onClick={() => changePhoneNumberVisibility()}
            disabled={isPhoneNumberVisibilityLoading}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-indigo-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            Näita minu telefoninumbrit profiilil
          </span>
        </label>
        <TextInput
          label={'Meiliaadress'}
          value={user?.email}
          disabled
          onChange={{}}
          isSaving={false}
        />
        {socialChannels?.map((channel) => (
          <div className="flex items-end w-full gap-1">
            <TextInput
              label={channel.name}
              value={channel.link}
              onChange={{}}
              placeholder={channel.link}
              isSaving={false}
              disabled
            />
            {/* delete button */}
            <button
              onClick={() =>
                deleteChannel(channel.id, {
                  onSuccess: () => {
                    refetch();
                  },
                })
              }
              className="flex items-center justify-center w-10 h-10 py-2 text-base font-normal rounded-lg hover:bg-neutral-200 text-neutral-900 bg-neutral-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
              >
                <path
                  d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
        {isUserAddingNewChannel && (
          <div className="flex w-full gap-1">
            <TextInput
              label={''}
              value={newChannel.name}
              onChange={handleAddNewChannelName}
              placeholder={'nt Facebook, Twitter'}
              isSaving={false}
            />
            <TextInput
              label={''}
              value={newChannel.link}
              onChange={handleAddNewChannelLink}
              placeholder={'nt Mati Mets, @matimets'}
              isSaving={false}
            />
          </div>
        )}
        <div className="flex w-full gap-1">
          {isUserAddingNewChannel && (
            <button
              onClick={() => setIsUserAddingNewChannel(false)}
              className="w-full py-2 text-base font-normal rounded-lg hover:bg-neutral-200 text-neutral-900 bg-neutral-100 "
            >
              Tühista
            </button>
          )}
          <button
            onClick={() => handleAddNewChannelClick()}
            disabled={
              ((!newChannel?.link || !newChannel?.name) &&
                isUserAddingNewChannel) ||
              isAddingNewChannelLoading
            }
            className="flex items-center justify-center w-full py-2 text-base font-normal text-white bg-indigo-600 rounded-lg disabled:bg-indigo-400 hover:bg-indigo-700"
          >
            {isUserAddingNewChannel && !isAddingNewChannelLoading && 'Lisa'}
            {!isUserAddingNewChannel && 'Lisa võõrkeel'}
            {isAddingNewChannelLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="animate-spin"
              >
                <path
                  opacity="0.15"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#6366F1"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
                  fill="url(#paint0_linear_2435_9909)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2435_9909"
                    x1="12"
                    y1="12.5"
                    x2="12"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#6366F1" />
                    <stop
                      offset="1"
                      stopColor="#6366F1"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </button>
        </div>
        <h1 className="w-full text-left">Asukoht</h1>
        <div className="w-full">
          <label className="inline-block w-full text-sm font-semibold text-left">
            Asukoht
          </label>
          <PlacesAutocomplete
            value={primaryAddress}
            onChange={(value: string) => setPrimaryAddress(value)}
            onSelect={setPrimaryAddress}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="relative w-full">
                <div className="relative flex items-center">
                  <input
                    {...getInputProps({
                      placeholder: 'Alusta aadressi kirjutamisega...',
                    })}
                    className="w-full px-3 py-2 border border-b rounded-lg outline-none appearance-none border-neutral-400"
                  />
                  {isPrimaryAddressChangeLoading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="absolute right-3 animate-spin"
                    >
                      <path
                        opacity="0.15"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        fill="#6366F1"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
                        fill="url(#paint0_linear_2435_9909)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2435_9909"
                          x1="12"
                          y1="12.5"
                          x2="12"
                          y2="20"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#6366F1" />
                          <stop
                            offset="1"
                            stopColor="#6366F1"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>

                <div className="rounded-lg shadow-md">
                  {loading ? <div>Otsin...</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? '#ccc' : '#fff',
                    };

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion)}
                        key={suggestion.description}
                        className="p-2 m-2 text-sm bg-white rounded hover:bg-indigo-100"
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div className="w-full">
          <label className="inline-block w-full text-sm font-semibold text-left">
            Alternatiivne asukoht
          </label>
          <PlacesAutocomplete
            value={secondaryAddress}
            onChange={(value: string) => setSecondaryAddress(value)}
            onSelect={setSecondaryAddress}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="relative w-full">
                <div className="relative flex items-center">
                  <input
                    {...getInputProps({
                      placeholder: 'Alusta aadressi kirjutamisega...',
                    })}
                    className="w-full px-3 py-2 border border-b rounded-lg outline-none appearance-none border-neutral-400"
                  />
                  {isSecondaryAddressChangeLoading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="absolute right-3 animate-spin"
                    >
                      <path
                        opacity="0.15"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        fill="#6366F1"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
                        fill="url(#paint0_linear_2435_9909)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2435_9909"
                          x1="12"
                          y1="12.5"
                          x2="12"
                          y2="20"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#6366F1" />
                          <stop
                            offset="1"
                            stopColor="#6366F1"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>

                <div className="rounded-lg shadow-md">
                  {loading ? <div>Otsin...</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? '#ccc' : '#fff',
                    };

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion)}
                        key={suggestion.description}
                        className="p-2 m-2 text-sm bg-white rounded hover:bg-indigo-100"
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        {aadresses?.map((address, index) => (
          <div className="flex items-end w-full gap-1">
            <TextInput
              label={`Alternatiivne asukoht ${index + 1}`}
              value={address}
              onChange={{}}
              disabled
              isSaving={false}
            />
            <button
              onClick={() => handleDeleteAddress(address)}
              className="flex items-center justify-center w-10 h-10 py-2 text-base font-normal rounded-lg hover:bg-neutral-200 text-neutral-900 bg-neutral-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
              >
                <path
                  d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                  stroke="#0F172A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
        {isUserAddingNewAddress && (
          <div className="w-full">
            <PlacesAutocomplete
              value={addAddress}
              onChange={(value: string) => setAddAddress(value)}
              onSelect={setAddAddress}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className="relative w-full">
                  <div className="relative flex items-center">
                    <input
                      {...getInputProps({
                        placeholder: 'Alusta aadressi kirjutamisega...',
                      })}
                      className="w-full px-3 py-2 border border-b rounded-lg outline-none appearance-none border-neutral-400"
                    />
                  </div>

                  <div className="rounded-lg shadow-md">
                    {loading ? <div>Otsin...</div> : null}

                    {suggestions.map((suggestion) => {
                      const style = {
                        backgroundColor: suggestion.active ? '#ccc' : '#fff',
                      };

                      return (
                        <div
                          {...getSuggestionItemProps(suggestion)}
                          key={suggestion.description}
                          className="p-2 m-2 text-sm bg-white rounded hover:bg-indigo-100"
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
        )}
        <div className="flex w-full gap-1">
          <div className="flex w-full gap-1">
            {isUserAddingNewAddress && (
              <button
                onClick={() => setIsUserAddingNewAddress(false)}
                className="w-full py-2 text-base font-normal rounded-lg hover:bg-neutral-200 text-neutral-900 bg-neutral-100 "
              >
                Tühista
              </button>
            )}

            <button
              onClick={() => handleAddNewAddress()}
              className="flex items-center justify-center w-full py-2 text-base font-normal text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              disabled={
                (!addAddress && isUserAddingNewAddress) ||
                isAddingNewAddressLoading
              }
            >
              {isUserAddingNewAddress && !isAddingNewAddressLoading && 'Lisa'}
              {!isUserAddingNewAddress && 'Lisa asukoht'}
              {isAddingNewAddressLoading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="animate-spin"
                >
                  <path
                    opacity="0.15"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#6366F1"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
                    fill="url(#paint0_linear_2435_9909)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2435_9909"
                      x1="12"
                      y1="12.5"
                      x2="12"
                      y2="20"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#6366F1" />
                      <stop
                        offset="1"
                        stopColor="#6366F1"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </button>
          </div>
        </div>
        <h1 className="w-full text-left">Keeled</h1>
        <div className="w-full">
          <label className="inline-block w-full text-sm font-semibold text-left">
            Emakeel
          </label>
          <DropdownSelectPrimary
            onClick={handlePrimaryLanguageChange}
            selectedLanguage={primaryLanguage}
            isSaving={isPrimaryLanguageChangeLoading}
            isDropdownOpen={isPrimaryLanguageDropdownOpen}
            setIsDropdownOpen={setIsPrimaryLanguageDropdownOpen}
          />
        </div>
        <div className="w-full">
          <label className="inline-block w-full text-sm font-semibold text-left justifty-end">
            Võõrkeeled
          </label>
          <div className="flex flex-col gap-1">
            {otherLanguages?.map(({ language, level, id }) => (
              <div className="flex items-end gap-1">
                <button
                  className="relative flex items-center justify-between w-full px-3 py-2 text-center border rounded-lg border-neutral-400"
                  type="button"
                >
                  {language}{' '}
                </button>
                <div className="w-full">
                  <p className="text-sm">Tase</p>
                  <button
                    className="relative flex items-center justify-between w-full px-3 py-2 text-center border rounded-lg border-neutral-400"
                    type="button"
                  >
                    {level}{' '}
                  </button>
                </div>
                <button
                  onClick={() =>
                    deleteLanguage(id, { onSuccess: () => refetch() })
                  }
                  className="flex items-center justify-center w-20 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5"
                  >
                    <path
                      d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                      stroke="#0F172A"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {isUserAddingNewLanguage && (
            <div className="flex items-end gap-1">
              <div className="relative w-full">
                <button
                  onClick={() =>
                    setIsNewLanguageDropdownOpen(!isNewLanguageDropdownOpen)
                  }
                  className="relative flex items-center justify-between w-full px-3 py-2 text-center border rounded-lg border-neutral-400"
                  type="button"
                >
                  {newLanguage?.language ? newLanguage?.language : 'Vali keel'}
                  <svg
                    className="w-4 h-4 ml-2"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {isNewLanguageDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-md">
                    <ul className="p-2 text-sm text-gray-700 dark:text-gray-200">
                      {languages
                        ?.filter(
                          (language) =>
                            !otherLanguages?.some(
                              ({ language: userLanguage }) =>
                                userLanguage === language
                            )
                        )
                        ?.map((language) => (
                          <li>
                            <p
                              onClick={() => handleNewLanguageClick(language)}
                              className="block p-2 bg-white rounded cursor-pointer hover:bg-indigo-100"
                            >
                              {language}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="w-full">
                <p className="text-sm">Tase</p>
                <div className="relative w-full">
                  <button
                    onClick={() =>
                      setIsNewLanguageLevelDropdownOpen(
                        !isNewLanguageLevelDropdownOpen
                      )
                    }
                    className="relative flex items-center justify-between w-full px-3 py-2 text-center border rounded-lg border-neutral-400"
                    type="button"
                  >
                    {newLanguage?.level ? newLanguage?.level : 'Vali tase'}
                    <svg
                      className="w-4 h-4 ml-2"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  {isNewLanguageLevelDropdownOpen && (
                    <div className="absolute z-10 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-md">
                      <ul className="p-2 text-sm text-gray-700 dark:text-gray-200">
                        {levels?.map((level) => (
                          <>
                            <p className="pl-4 m-2 text-xs font-semibold text-neutral-500">
                              Tasemed
                            </p>
                            {level.certified.map((certified) => (
                              <li>
                                <p
                                  onClick={() =>
                                    handleNewLanguageLevelClick(certified)
                                  }
                                  className="block py-2 pl-10 text-sm bg-white rounded cursor-pointer hover:bg-indigo-100"
                                >
                                  {certified}
                                </p>
                              </li>
                            ))}
                            <p className="pl-4 m-2 text-xs font-semibold text-neutral-500">
                              Oskus
                            </p>
                            {level.notCertified.map((notCertified) => (
                              <li>
                                <p
                                  onClick={() =>
                                    handleNewLanguageLevelClick(notCertified)
                                  }
                                  className="block py-2 pl-10 text-sm bg-white rounded cursor-pointer hover:bg-indigo-100"
                                >
                                  {notCertified}
                                </p>
                              </li>
                            ))}
                          </>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full gap-1">
          {isUserAddingNewLanguage && (
            <button
              onClick={() => setIsUserAddingNewLanguage(false)}
              className="w-full py-2 text-base font-normal rounded-lg hover:bg-neutral-200 text-neutral-900 bg-neutral-100 "
            >
              Tühista
            </button>
          )}
          <button
            onClick={() => handleAddNewLanguageClick()}
            className="flex items-center justify-center w-full py-2 text-base font-normal text-white bg-indigo-600 rounded-lg disabled:bg-indigo-400 hover:bg-indigo-700"
            disabled={
              ((!newLanguage?.language || !newLanguage?.level) &&
                isUserAddingNewLanguage) ||
              isAddingNewLanguageLoading
            }
          >
            {isUserAddingNewLanguage && !isAddingNewLanguageLoading && 'Lisa'}
            {!isUserAddingNewLanguage && 'Lisa võõrkeel'}
            {isAddingNewLanguageLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="animate-spin"
              >
                <path
                  opacity="0.15"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="#6366F1"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
                  fill="url(#paint0_linear_2435_9909)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2435_9909"
                    x1="12"
                    y1="12.5"
                    x2="12"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#6366F1" />
                    <stop
                      offset="1"
                      stopColor="#6366F1"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </button>
        </div>
        <h1 className="w-full text-left">Lisainfo</h1>

        <div className="relative w-full">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
          >
            Sisesta tekst, mida soovid enda kohta lisada (nt oma
            liikumismarsruutide kohta).
          </label>
          <textarea
            onChange={(e) => setAdditionalInfo(e.target.value)}
            id="message"
            rows={4}
            value={additionalInfo ?? ''}
            className="block p-2.5 w-full relative text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Kirjuta lisainfo siia..."
          ></textarea>
          {isAdditionalInfoChangeLoading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute top-0 right-3 animate-spin"
            >
              <path
                opacity="0.15"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#6366F1"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
                fill="url(#paint0_linear_2435_9909)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2435_9909"
                  x1="12"
                  y1="12.5"
                  x2="12"
                  y2="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop
                    offset="1"
                    stopColor="#6366F1"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        <div className="w-full text-sm text-center text-indigo-600">
          <Link href={`/user/${user?.id}`}>Vaata oma profiili</Link>
        </div>
      </div>
    </Layout>
  );
};

function TextInput({ label, value, onChange, isSaving, ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block w-full mb-1 text-sm font-semibold text-left">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full gap-2">
        <input
          className="w-full px-3 py-2 border rounded-lg border-neutral-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
        {isSaving && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute right-3 animate-spin"
          >
            <path
              opacity="0.15"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#6366F1"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
              fill="url(#paint0_linear_2435_9909)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2435_9909"
                x1="12"
                y1="12.5"
                x2="12"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#6366F1" />
                <stop
                  offset="1"
                  stopColor="#6366F1"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </div>
  );
}
function DropdownSelectPrimary({
  onClick,
  selectedLanguage,
  isSaving,
  isDropdownOpen,
  setIsDropdownOpen,
}) {
  return (
    <>
      <button
        className="relative flex items-center justify-between w-full px-3 py-2 text-center border rounded-lg border-neutral-400"
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedLanguage}{' '}
        {isSaving ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute right-3 animate-spin"
          >
            <path
              opacity="0.15"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#6366F1"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4Z"
              fill="url(#paint0_linear_2435_9909)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2435_9909"
                x1="12"
                y1="12.5"
                x2="12"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#6366F1" />
                <stop
                  offset="1"
                  stopColor="#6366F1"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        )}
      </button>
      {isDropdownOpen && (
        <div className="z-10 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-md">
          <ul className="p-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <p
                onClick={() => onClick('Eesti keel')}
                className="block p-2 bg-white rounded cursor-pointer hover:bg-indigo-100"
              >
                Eesti keel
              </p>
            </li>
            <li>
              <p
                onClick={() => onClick('Vene keel')}
                className="block p-2 bg-white rounded cursor-pointer hover:bg-indigo-100"
              >
                Vene keel
              </p>
            </li>
            <li>
              <p
                onClick={() => onClick('Inglise keel')}
                className="block p-2 bg-white rounded cursor-pointer hover:bg-indigo-100"
              >
                Inglise keel
              </p>
            </li>
            <li>
              <p
                onClick={() => onClick('Soome keel')}
                className="block p-2 bg-white rounded cursor-pointer hover:bg-indigo-100"
              >
                Soome keel
              </p>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Account;
