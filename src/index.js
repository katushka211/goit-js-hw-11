import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};
let page = 1;

refs.form.addEventListener('submit', onSearch);
// refs.buttonLoadMore.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  const searchImage = refs.input.value;
  //   console.log(searchImage);
  refs.input.value = '';
  page = 1;
  if (searchImage) {
    getImages(searchImage);
  } else {
    Notiflix.Notify.info('Please enter a search term');
  }

  async function getImages(searchImage) {
    try {
      const API_KEY = '34605013-ed7b70ee5300a8874900b8fd4';
      const response = await axios.get(
        `https://pixabay.com/api/?key=${API_KEY}&q=${searchImage}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      if (response.data.hits.length > 0) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      } else {
        Notiflix.Notify.failure(
          `"Sorry, there are no images matching your search query. Please try again."`
        );
      }
      createGallery(response.data);
    } catch (error) {
      console.log(error);
    }
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
}
