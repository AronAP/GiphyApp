'use strict';

var API_KEY = 'e9Btu1sRR7ZMsXlTs3uF7B8KpavRuGBf';
var URL_GIFS = 'api.giphy.com/v1/gifs/search';
var LIMIT_STICKERS_ON_PAGE = 8;

var input = document.querySelector('.nav__input');
var btnFind = document.querySelector('.nav__search');
var btnRefresh = document.querySelector('.nav__refresh');
var out = document.querySelector('.content__out');
var loader = document.querySelector('.content__loader');
var progressBar = document.querySelector('.progress-bar');

var requestList = [];

/**
 * Gets a input value and returns it to its normal form.
 *
 */
function getInputValue() {
  var val = input.value.trim();
  var newVal = '';

  for (var i = 0; i < val.length; i++) {
    var elem = val[i];

    if (elem == ' ') {
      elem = '+';
    }
    newVal += elem;
  }

  if (newVal != '') {
    requestList.unshift(newVal);
  }
}

/**
 * Creates a link to the GIF.
 *
 * @param {Number} offset - the number of GIFs to skip.
 * @returns createdUrl - link to the GIF.
 */
function createUrl(offset) {
  getInputValue();

  var value = requestList[0];

  if (typeof value == 'undefined') {
    return;
  }

  var createdUrl = 'https://' + URL_GIFS + '?api_key=' + API_KEY + '&q=' + value + '&limit=' + LIMIT_STICKERS_ON_PAGE + '&offset=' + offset;

  return createdUrl;
}

/**
 * Crops GIF names.
 *
 * @param {*} title - name of the GIF.
 * @returns title - cropped name GIF.
 */
function trimGifsName(title) {
  var str = '';

  for (var i = 0; i < title.length; i++) {
    var char = title[i];
    str += char;

    if (i > 14) {
      str += '...';
      title = str;
      return title;
    }
  }

  title = str;
  return title;
}

/**
 * Creates a card with a GIF and displays it.
 *
 * @param {*} elem - object with a GIF.
 */
function createGifsElem(elem) {

  var title = trimGifsName(elem.title);

  var gif = document.createElement('div');

  gif.classList.add('content__gif', 'gif');
  gif.innerHTML = '\n              <figure class="gif__figure">\n                <img\n                  src="' + elem.images.original.url + '"\n                  class="gif__img" title="' + elem.title + '">\n                <figcaption class="gif__name">' + title + '</figcaption>\n              </figure>\n              <button class="gif__info-button">i</button>\n              <div class="gif__info">\n                <div class="gif__size">' + elem.images.original.width + 'x' + elem.images.original.height + '</div>\n                <button class="gif__button" onclick="window.open(\'' + elem.url + '\');" target="_blank">Original</button>\n              </div>\n  ';

  out.insertAdjacentElement('beforeend', gif);
}

/**
 * Shows GIF information.
 *
 * @param {*} elem - GIF.
 */
function showInfo(elem) {
  elem.style.display = 'flex';
}

/**
 * Hides GIF information.
 *
 * @param {*} elem - GIF.
 */
function hideInfo(elem) {
  elem.style.display = 'none';
}

/**
 * Shows the preloader of a GIFs.
 *
 */
function showLoader() {
  loader.classList.remove('hide');
}

/**
 * Hides the preloader of a GIFs.
 *
 */
function hideLoader() {
  loader.classList.add('hide');
}

/**
 * Looking for gifs.
 *
 * @param {*} url - address GIFs.
 */
function searchGifs(url) {

  fetch(url).then(function (response) {
    return response.json();
  }).then(function (content) {

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

    var loadedImagesCount = 0;
    var totalImagesCount = content.data.length;

    content.data.forEach(function (elem) {
      createGifsElem(elem);
    });

    var img = document.querySelectorAll('.gif__img');

    img.forEach(function (image) {
      image.onload = function () {
        loadedImagesCount++;

        progressBar.classList.remove('done');
        progressBar.style.width = (100 / totalImagesCount * loadedImagesCount << 0) + '%';

        if (loadedImagesCount === totalImagesCount) {
          progressBar.classList.add('done');
          hideLoader();
        }
      };
    });

    // Hang up click on the Info button of all GIFs.
    var btnInfo = document.querySelectorAll('.gif__info-button');

    btnInfo.forEach(function (btn) {
      var info = btn.nextSibling.nextSibling;

      btn.addEventListener('click', function () {
        showInfo(info);
      });

      info.addEventListener('click', function () {
        hideInfo(info);
      });
    });

    input.value = '';
  }).catch(function (err) {
    console.error(err);
  });
}

var refreshCounter = 0;

btnFind.addEventListener('click', function (e) {
  e.preventDefault();

  refreshCounter = 0;

  var url = createUrl(0);

  searchGifs(url);
});

btnRefresh.addEventListener('click', function () {
  refreshCounter += 8;

  var url = createUrl(refreshCounter);

  searchGifs(url);
});