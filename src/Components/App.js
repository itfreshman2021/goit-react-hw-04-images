import { useState, useEffect } from 'react';
import s from './App.module.css';
import { getImagesWithAxios } from '../services/getimageswithaxios';
import Searchbar from './searchbar/Searchbar';
import { Watch } from 'react-loader-spinner';
import ImageGallery from './imageGallery/ImageGallery';
import Button from './button/Button';
import Modal from './modal/Modal';

export default function App() {
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(1);
  const [dataImages, setDataImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (searchName === '') {
      return;
    }

    const config = {
      url: 'https://pixabay.com/api/',
      params: {
        key: '24632076-61665c6939d01412ec2d82576',
        q: searchName,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '12',
        page: page,
      },
    };

    getImagesWithAxios(config).then(dataImages => {
      if (!dataImages) {
        setIsLoading(false);
        return;
      }
      setDataImages(prevState => [...prevState, ...dataImages]);
      setIsLoading(false);

      if (page > 1) {
        const { height: cardHeight } = document
          .querySelector('#ul1')
          .lastElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    });
  }, [searchName, page]);

  const handleFormSubmit = searchName => {
    setSearchName(searchName);
    setPage(1);
    setDataImages([]);
    setShowModal(false);
    setIsLoading(true);
  };

  const onButtonLoadMoreClick = () => {
    setPage(prevState => prevState + 1);
    setIsLoading(true);
  };
  const togleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const handleModalImage = id => {
    setLargeImageURL(dataImages.find(dataImage => dataImage.id === id).largeImageURL);
    setAlt(dataImages.find(dataImage => dataImage.id === id).tags);

    togleModal();
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      {isLoading && (
        <div className={s.Loader}>
          <Watch color="#00BFFF" height={80} width={80} />
        </div>
      )}
      {showModal && <Modal onClose={togleModal} largeImageURL={largeImageURL} alt={alt} />}
      {dataImages.length > 0 && (
        <>
          <ImageGallery onClick={handleModalImage} dataImages={dataImages} />
          {!isLoading && (
            <div className={s.Btn}>
              <Button onButtonLoadMoreClick={onButtonLoadMoreClick} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
