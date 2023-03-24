import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let page = 1;
refs.loadMoreBtn.style.display = 'none';

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearch(event) {
  event.preventDefault();
  const searchImage = refs.input.value;
  //   console.log(searchImage);
  refs.gallery.innerHTML = '';
  page = 1;
  if (searchImage) {
    getImages(searchImage);
  } else {
    Notiflix.Notify.info('Please enter a search term');
  }
}

async function getImages(searchImage) {
  try {
    const API_URL = 'https://pixabay.com/api/';
    const API_KEY = '34605013-ed7b70ee5300a8874900b8fd4';
    const params = {
      key: API_KEY,
      q: searchImage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    };
    const response = await axios.get(API_URL, { params });
    if (response.data.hits.length > 0 && page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      refs.loadMoreBtn.style.display = 'block';
    }
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        `"Sorry, there are no images matching your search query. Please try again."`
      );
    }
    if (response.data.hits.length < 40 && response.data.hits.length > 0) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    createGallery(response.data);
    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}

function createGallery(array) {
  const markup = array.hits
    .map(
      item => `<a href = "${item.largeImageURL}">
  <div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${item.downloads}
    </p>
  </div>
</div>
  </a>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightbox.refresh();
}

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

function onLoadMoreBtnClick(event) {
  event.preventDefault();
  const searchImage = refs.input.value;
  page += 1;
  getImages(searchImage);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
