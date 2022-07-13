import ImageApi from './js/imageApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import galleryTpl from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageApi = new ImageApi();
let gallery = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const handleQuery = async () => {
  try {
    Loading.circle('Loading...');
    const data = await imageApi.getRequest();

    appendGalleryMarkup(data);
    Loading.remove();
    refs.loadMoreBtn.classList.remove('is-hidden');

    gallery.refresh();
    checkDataLength(data);
    cheсkRestHits();
  } catch (error) {
    Loading.remove();
    refs.loadMoreBtn.classList.add('is-hidden');
    console.log(error);
  }
};

const onFormSubmit = async e => {
  e.preventDefault();
  imageApi.query = e.currentTarget.elements.searchQuery.value.trim();

  refs.loadMoreBtn.classList.add('is-hidden');
  clearGalleryContainer();
  imageApi.resetPage();
  imageApi.resetTotalHits();

  if (imageApi.searchQuery === '') {
    Notify.failure('Sorry, enter a query in the search field.', {
      width: '500px',
      fontSize: '28px',
    });
    return;
  }

  await handleQuery();
  notificationToltalHits();
};

refs.searchForm.addEventListener('submit', onFormSubmit);

const onLoadMoreImage = async () => {
  await handleQuery();
  scrollPage();
};
refs.loadMoreBtn.addEventListener('click', onLoadMoreImage);

function appendGalleryMarkup(data) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', galleryTpl(data));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.3,
    behavior: 'smooth',
  });
}

function notificationToltalHits() {
  const totalHits = imageApi.totalHitsApi;
  if (totalHits > 0) {
    Notify.success(`Hooray! We found ${totalHits} images.`, {
      width: '500px',
      fontSize: '28px',
    });
  }
}

function checkDataLength(data) {
  if (data.length === 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
      width: '500px',
      fontSize: '28px',
    });
    Loading.remove();
  }
}

function cheсkRestHits() {
  if (imageApi.totalHitsApi === 0) return;
  if (imageApi.totalHitsApi <= imageApi.receivedHitsApi) {
    Notify.warning("We're sorry, but you've reached the end of search results.", {
      width: '500px',
      fontSize: '28px',
    });
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}
