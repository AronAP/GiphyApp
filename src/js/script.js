const API_KEY = 'e9Btu1sRR7ZMsXlTs3uF7B8KpavRuGBf';
const URL_GIFS = 'api.giphy.com/v1/gifs/search';
const LIMIT_STICKERS_ON_PAGE = 8;

const input = document.querySelector('.nav__input');
const btnFind = document.querySelector('.nav__search');
const btnRefresh = document.querySelector('.nav__refresh');
const out = document.querySelector('.content__out');
const loader = document.querySelector('.content__loader');
const progressBar = document.querySelector('.progress-bar');

let requestList = [];

function getInputValue() {
  let val = input.value.trim();
  let newVal = '';

  for (let i = 0; i < val.length; i++) {
    let elem = val[i];

    if (elem == ' ') {
      elem = '+';
    }
    newVal += elem;
  }

  if (newVal != '') {
    requestList.unshift(newVal);
  }
}

function createUrl(offset) {
  getInputValue();

  const value = requestList[0];

  if (typeof value == 'undefined') {
    return;
  }

  let createdUrl = `https://${URL_GIFS}?api_key=${API_KEY}&q=${value}&limit=${LIMIT_STICKERS_ON_PAGE}&offset=${offset}`

  return createdUrl;
}


function trimGifsName(title) {
  let str = '';

  for (let i = 0; i < title.length; i++) {
    const char = title[i];
    str += char;

    if (i > 14) {
      str += '...'
      title = str;
      return title;
    }
  }

  title = str;
  return title;
}

function createGifsElem(elem) {

  let title = trimGifsName(elem.title);

  let gif = document.createElement('div');

  gif.classList.add('content__gif', 'gif');
  gif.innerHTML = `
              <figure class="gif__figure">
                <img
                  src="${elem.images.original.url}"
                  class="gif__img" title="${elem.title}">
                <figcaption class="gif__name">${title}</figcaption>
              </figure>
              <button class="gif__info-button">i</button>
              <div class="gif__info">
                <div class="gif__size">${elem.images.original.width}x${elem.images.original.height}</div>
                <button class="gif__button" onclick="window.open('${elem.url}');" target="_blank">Original</button>
              </div>
  `;

  out.insertAdjacentElement('beforeend', gif);
}

function showInfo(elem) {
  elem.style.display = 'flex';
}

function hideInfo(elem) {
  elem.style.display = 'none';
}

function showLoader() {
  loader.classList.remove('hide');
}

function hideLoader() {
  loader.classList.add('hide');

}

function searchGifs(url) {

  fetch(url)
    .then(response => response.json())
    .then(content => {

      if (content.meta.status != 200) {
        return;
      }

      if (content.pagination.total_count < content.pagination.offset) {
        btnRefresh.setAttribute('disabled', '');
        return;
      }

      out.innerHTML = '';
      btnRefresh.removeAttribute('disabled');
      showLoader();

      let loadedImagesCount = 0;
      let totalImagesCount = content.data.length;

      content.data.forEach(elem => {
        createGifsElem(elem);
      });

      const img = document.querySelectorAll('.gif__img');

      img.forEach(image => {
        image.onload = function () {
          loadedImagesCount++;

          progressBar.classList.remove('done');
          progressBar.style.width = `${( ((100 / totalImagesCount) * loadedImagesCount) << 0)}%`;


          if (loadedImagesCount === totalImagesCount) {
            progressBar.classList.add('done');
            hideLoader();
          }
        }
      });

      const btnInfo = document.querySelectorAll('.gif__info-button');

      btnInfo.forEach(btn => {
        const info = btn.nextSibling.nextSibling;

        btn.addEventListener('click', function () {
          showInfo(info);
        });

        info.addEventListener('click', function () {
          hideInfo(info);
        });
      });

      input.value = '';
    })
    .catch(err => {
      console.error(err);
    })
}

let refreshCounter = 0;

btnFind.addEventListener('click', e => {
  e.preventDefault();

  refreshCounter = 0;

  const url = createUrl(0);

  searchGifs(url);
});


btnRefresh.addEventListener('click', () => {
  refreshCounter += 8;

  const url = createUrl(refreshCounter);

  searchGifs(url);
});
