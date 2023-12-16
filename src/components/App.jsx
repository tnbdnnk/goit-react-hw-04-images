import React, { useState, useEffect } from 'react';
import { fetchImageGallery } from '../api/PixabayAPI';
import toast, { Toaster } from 'react-hot-toast';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { BtnLoadMore } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Error } from './Error/Error';

const App = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imageGallery, setImageGallery] = useState([]);
    const [error, setError] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const [loadMore, setLoadMore] = useState(true);
    const [totalHits, setTotalHits] = useState(0);

    const handleSearchImg = (newImg) => {
        setQuery(newImg);
        setPage(1);
        setImageGallery([]);
        setToastShown(false);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const queryImgGallery = async (query, page) => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetchImageGallery(query, page);
                const { hits, totalHits } = res;
                
            if (!hits || hits.length === 0) {
                toast.error('No images found, please change your search query', {
                    style: { width: '1000px', height: '60px' },
                });
                setLoading(false);
                setLoadMore(false);
            } else {
                    if (!toastShown && hits.length > 0) {
                        toast.success('We found images');
                        setToastShown(true);
                    }
                    setImageGallery((prevGallery) => [...prevGallery, ...hits]);
                    setLoadMore(page < Math.ceil(totalHits / 12));
                    setLoading(false);
                    setError(false);
                    setTotalHits(totalHits);
                }
            } catch (error) {
                console.error(error);
                setError(true);
                setLoading(false);
            }
        };

        queryImgGallery(query, page);
    }, [query, page, toastShown, totalHits]);

    return (
        <div>
        <SearchBar onSubmit={handleSearchImg} />
        {loading && <Loader />}
        {error && <Error>Whoops! Error! Please reload this page!</Error>}
        {imageGallery.length > 0 && <ImageGallery apiImage={imageGallery} />}
        {loadMore && imageGallery.length > 0 && <BtnLoadMore onClick={handleLoadMore} />}
        <Toaster
            position="top-right"
            toastOptions={{
            style: {
                height: '40px',
                fontSize: '20px',
                fontWeight: '400',
                lineHeight: '20px',
            },
            }}
        />
        </div>
    );
};

export default App;


