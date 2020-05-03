// const getUser = new Promise((resolve, reject) => {
//   // llamar un Api con cierto tiempo
//   setTimeout(() => {
//     resolve(' getUser - todo estâ bien en la vida');
//     // reject(' getUser - algo Saliô mal o se me acabô el tiempo');
//   }, 2000);
// });

// const getUserAll = new Promise((resolve, reject) => {
//   // llamar un Api con cierto tiempo
//   setTimeout(() => {
//     resolve(' getUserAll - todo estâ bien en la vida');
//     // reject(' getUserAll - algo Saliô mal o se me acabô el tiempo');
//   }, 10000);
// });

// ------ Ejercicio 1: llamada de una Promesa ----------

// getUser
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((msg) => {
//     console.log(msg);
//   });
// ----------- Fin Ejercio 1-------------------

// ------ Ejercicio 2: llamada de un Arreglo de Promesas en paralelo ----------
// Promise.all([getUser, getUserAll])
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((msg) => {
//     console.log(msg);
//   });
// ----------- Fin Ejercio 2-------------------

// ------ Ejercicio 3: llamada de un Arreglo de Promesas en paralelo ----------
// Promise.race([getUser, getUserAll])
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((msg) => {
//     console.log(msg);
//   });
// ----------- Fin Ejercio 3-------------------

// -----------LLAMADO DE APIs CON PROMESAS

// ------ Ejercicio 4: llamada de API en AJAX ----------

// $.ajax('https://randomuser.me/api/', {
//   method: 'GET',
//   success: function (data) {
//     console.log('user', data);
//   },
//   error: function (error) {
//     console.log(error);
//   },
// });
// ----------- Fin Ejercio 4-------------------

// ------ Ejercicio 5: llamada de API con vanilla JS ----------
// const URL_API_USERS = 'https://randomuser.me/api/';
// fetch(URL_API_USERS + '?results=7')
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (users) {
//     console.log('users', users); //.results[0].name.first
//   })
//   .catch(function () {
//     console.log('fallo');
//   });
// ----------- Fin Ejercio 5-------------------

// ------ Ejercicio 6: llamada de API ASINCRONICA ----------
(async function load() {
  document.querySelector('.home-sidebar').classList.add('hidden');
  document.querySelector('.home').classList.replace('home', 'sidebar-hidden');
  const URL_API_MOVIES = 'https://yts.mx/api/v2/';
  const URL_API_USERS = 'https://randomuser.me/api/';

  // SE con promesas o async-await se hace el Fetch
  async function getDaticos(url) {
    // carga peliculas
    const responseMovies = await fetch(url);
    const movieList = await responseMovies.json();
    // console.log(movieList);
    if (movieList.data.movie_count > 1) {
      return movieList;
    }
    throw new Error('No se encontraron resultados coincidentes');
  }

  function setAttributes($element, attibutes) {
    for (const attribute in attibutes) {
      $element.setAttribute(attribute, attibutes[attribute]);
    }
  }

  // ===USERS ======
  const $userList = document.querySelector('.playlistFriends');

  function usersTemplate(user) {
    return `  <li class="playlistFriends-item">
          <a href="#">
            <img src="${user.picture.thumbnail}" alt="${user.name} - ${user.email}" />
            <span>
            ${user.name.first} ${user.name.last} 
            </span>
          </a>
        </li>`;
  }

  function renderUserList(users) {
    users.forEach((user) => {
      const HTMLString = usersTemplate(user);
      const userElement = createTemplateList(HTMLString);
      $userList.append(userElement);
    });
  }

  async function getUsuarios(url) {
    // carga usuarios de la API
    const responseUsers = await fetch(url);
    const usersList = await responseUsers.json();
    return usersList.results;
  }

  try {
    const users = await getUsuarios(
      `${URL_API_USERS}?results=20&nat=us,dk,fr,gb`
    );
    renderUserList(users);
  } catch (error) {
    alert('hubo un error al cargar la lista de miembros');
  }

  // =========UPCOMING=========

  const $upcomingList = document.querySelector('.myPlaylist');

  function upcomingMovieTemplate(upcomingMovie) {
    return `<li class="myPlaylist-item">
      <a href="#" title="${upcomingMovie.summary}">
        <span>
          ${upcomingMovie.title} (${upcomingMovie.rating}⭐)
        </span>
      </a>
    </li>`;
  }

  function renderUpcomingList(upcomingList) {
    upcomingList.forEach((upcoming) => {
      const HTMLString = upcomingMovieTemplate(upcoming);
      const upcominMovieElement = createTemplateList(HTMLString);
      // debugger;
      $upcomingList.append(upcominMovieElement);
    });
  }

  async function getUpcomingList(urlNextMovies) {
    const responseNextsMovies = await fetch(urlNextMovies);
    const upcomingMovieList = await responseNextsMovies.json();
    return upcomingMovieList;
  }

  const {
    data: { movies: upcomingList },
  } = await getUpcomingList(
    `${URL_API_MOVIES}list_movies.json?with_rt_ratings=false&limit=10&sort_by=rating`,
    'action'
  );
  JSON.stringify(upcomingList);
  localStorage.setItem('upcomingList', upcomingList);
  renderUpcomingList(upcomingList);

  // ========== buscar pelîcula =====
  // trabajo con EL formaulario de bûsqueda
  const $home = document.getElementById('home');
  const $form = document.getElementById('form');
  // const $featuringContainer = document.getElementById('featuring');

  // function featuringTemplate(movie) {
  //   return `<div class="featuring">
  //     <div class="featuring-image">
  //       <img src="${movie.medium_cover_image}" width="70" height="100" alt="">
  //     </div>
  //     <div class="featuring-content">
  //       <p class="featuring-title">Pelicula encontrada</p>
  //       <p class="featuring-album">${movie.title}</p>
  //     </div>
  //   </div>`;
  // }

  // elementos para el modal
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  // elementos del contenedor modal
  const $modalImage = $modal.querySelector('img');
  const $modalTitle = $modal.querySelector('h1');
  const $modalDescription = $modal.querySelector('p');
  const $download = $modal.querySelector('a');

  function findMovieById(list, id) {
    return list.find((movie) => movie.id === parseInt(id, 10));
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action':
        return findMovieById(actionList, id);
      case 'animation':
        return findMovieById(animationList, id);
      case 'drama':
        return findMovieById(dramaList, id);
      case 'results':
        return findMovieById(resultsList, id);
      default:
        return findMovieById(popularList, id);
    }
  }

  // Mostrar Modal con evento click
  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';

    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const movieDetails = findMovie(id, category);

    let summary = movieDetails.summary;

    if (summary.length > 500) {
      summary = summary.substring(0, 500) + '...';
    }
    $modalDescription.textContent = summary;
    $modalTitle.textContent = movieDetails.title;
    $modalImage.setAttribute('src', movieDetails.medium_cover_image);
    $download.setAttribute('href', movieDetails.torrents[0].url);
  }

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal($element);
    });
  }

  $hideModal.addEventListener('click', hideModal);
  $overlay.addEventListener('click', hideModal);
  function hideModal() {
    $modal.style.animation = 'modalOut .5s forwards';
    $overlay.classList.remove('active');
  }

  // contenedores
  const $popularContainer = document.querySelector('#popular');
  const $actionContainer = document.querySelector('#action');
  const $animationContainer = document.getElementById('animation');
  const $dramaContainer = document.getElementById('drama');
  const $resultContainer = document.getElementById('results');

  //plantilla para los items de la lista de videos
  function movieItemTemplate(movie, category) {
    return `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
               <div class="primaryPlaylistItem-image">
                 <img src="${movie.medium_cover_image}">
               </div>
               <h4 class="primaryPlaylistItem-title">
                ${movie.title}
               </h4>
               <div class="primaryPlaylistItem-subtitle">
                <div class="primaryPlaylistItem-subtitle-year">
                  ${movie.year}
                </div>  
                <div class="primaryPlaylistItem-subtitle-rating">
                ⭐${movie.rating}
                </div>              
              </div>
             </div>`;
  }

  function createTemplateList(HTMLString) {
    const appHtml = document.implementation.createHTMLDocument();
    appHtml.body.innerHTML = HTMLString;
    return appHtml.body.children[0];
  }

  // iteraciôn de listas
  function renderMovieList(list, $container, category) {
    list.forEach((movie) => {
      const HTMLString = movieItemTemplate(movie, category);
      const movieElement = createTemplateList(HTMLString);
      // debugger;
      $container.append(movieElement);
      // console.log(HTMLString);
      // Fade in effect
      const image = movieElement.querySelector('img');
      image.addEventListener('load', () => {
        image.classList.add('fadeIn');
      });
      addEventClick(movieElement);
    });
    $container.children[0].remove();
  }

  // ================== popular==============

  // =======CHACHE====================
  async function chacheExist(MovieCategory) {
    const categoryName = `${MovieCategory}List`;
    const cacheList = window.localStorage.getItem(categoryName);
    if (cacheList) {
      return JSON.parse(cacheList);
    }

    let parameters = null;
    if (MovieCategory == 'popular') {
      parameters = 'sort_by=like_count&limit=20';
    } else {
      parameters = `genre=${MovieCategory}`;
    }

    const {
      data: { movies: data },
    } = await getDaticos(
      `${URL_API_MOVIES}list_movies.json?${parameters}`,
      `${MovieCategory}`
    );

    localStorage.setItem(categoryName, JSON.stringify(data));
    return data;
  }

  // ========CONSULTA DE CONTENIDO DE LA API=============
  // Consulta de Api Con promesa
  // let dramaList = null;
  // getDaticos(URL_API_MOVIES + 'list_movies.json?genre=drama')
  //   .then((data) => {
  //     dramaList = data;
  //     console.log(dramaList);
  //   })
  //   .catch((error) => {
  //     console.log('hubo un error', error);
  //   });

  // otra manera:  Consulta de Api Con Async-await
  // const {
  //   data: { movies: actionList },
  // } = await getDaticos(
  //   `${URL_API_MOVIES}list_movies.json?genre=action`,
  //   'action'
  // );

  // JSON.stringify(actionList);
  // localStorage.setItem('actionList', actionList);
  const popularList = await chacheExist('popular');
  renderMovieList(popularList, $popularContainer, 'popular');

  const actionList = await chacheExist('action');
  renderMovieList(actionList, $actionContainer, 'action');

  const animationList = await chacheExist('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

  const dramaList = await chacheExist('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  let resultsList = null;

  $form.addEventListener('submit', async (event) => {
    const buscar = new FormData($form);
    event.preventDefault();
    $home.classList.add('search-active');

    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    });
    const $resultTitle = document.getElementById('result-title');
    $resultTitle.innerText = `Results for: ${buscar.get('name')}`;

    // $featuringContainer.append($loader);
    $resultContainer.append($loader);

    try {
      const {
        data: { movies: results },
      } = await getDaticos(
        `${URL_API_MOVIES}list_movies.json?limit=20&sort_by=date&order_by=desc&query_term=${buscar.get(
          'name'
        )}`
      );
      resultsList = results;
      // debugger;
      // Versiôn 2
      // const featureMovie = featuringTemplate(peli[0]);
      renderMovieList(resultsList, $resultContainer, 'results');
      // $resultContainer.innerHTML = featureMovie;
    } catch (error) {
      alert(error);
      $loader.remove();
      $resultTitle.innerText = `Sorry, No results for: ${buscar.get('name')}`;
      $resultContainer.innerText = '';
      $home.classList.remove('search-active');
    }
  });
})();
