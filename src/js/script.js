const API_KEY = 'e9Btu1sRR7ZMsXlTs3uF7B8KpavRuGBf';
const URL_GIFS = 'api.giphy.com/v1/gifs/search';
const LIMIT_STICKERS_ON_PAGE = 8;

const input = document.querySelector('.nav__input');
const btnFind = document.querySelector('.nav__search');
const out = document.querySelector('.content__out');

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

  return newVal;
}

function createUrl() {
  const value = getInputValue();

  let createdUrl = `https://${URL_GIFS}?api_key=${API_KEY}&q=${value}&limit=${LIMIT_STICKERS_ON_PAGE}`

  return createdUrl;
}

function createGifsElem(elem) {
  let fig = document.createElement('figure');
  let figCap = document.createElement('figcaption');
  let img = document.createElement('img');

  img.src = elem.images.original.url;
  img.title = elem.title;
  figCap.textContent = elem.title;

  fig.appendChild(img);
  fig.appendChild(figCap);

  out.insertAdjacentElement('beforeend', fig);
}

btnFind.addEventListener('click', e => {
  e.preventDefault();
  const url = createUrl();
  console.log('🙂: url', url);

  fetch(url)
    .then(response => response.json())
    .then(content => {
      console.log(content.data);
      console.log(content.meta);
      // console.log(content.pagination);

      if (content.meta.status != 200) {
        return;
      }

      out.innerHTML = '';

      let newGif = content.data;

      newGif.forEach(elem => {
        createGifsElem(elem);
      });

      input.value = '';
    })
    .catch(err => {
      console.error(err);

    })
});
