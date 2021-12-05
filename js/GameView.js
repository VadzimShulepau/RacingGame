export function GameView() {
  let bodyV = null;
  let resize = {};
  let wrapper = null;
  let gameWrapper = null;
  let startMessage = null;
  let nameInput = null;
  let message = null;
  let track = null;
  let carWrapper = null;
  let layout = null;
  let layoutB = null;
  let objectMess = null;
  let nameScore = null;
  let numberScore = null;
  let messageBefore = null;
  let overMessage = null;
  let userList = null;
  let userListBTN = null;
  let userListWrapper = null;
  let userItem = null;
  let messageSound = null;
  let reloadMSG = null;
  let startPageArrow = null;
  let descriptionArrow = null;
  let timerCount = null;
  let arrowIMG = null;
  let img = new Image();
  let soundIMG = null;
  let soundCheck = ["./png/volume-on.png", "./png/volume-off.png"];
  let flashStatus = ["./png/flashlight-on.png", "./png/flashlight-off.png"];
  let deleteUserMessage = null;
  let bip = null;
  let backMusic = null;
  let crashSound = null;
  let raceSound = null;
  let startSound = null;
  let flashlight = null;
  let flashlightB = null;
  let flashlightIMG = null;
  let timerCountSound = null;
  let lazzyLoad = null;
  let lazzyRound = null;
  let lazzyError = null;
  let position = 0;
  let car = {
    cor: 0,
    deg: 1,
    h: 100,
    w: 50,
    x: 0,
    y: 0,
  };

  let mess = {
    object: [
      "./png/car2.png",
      "./png/object.png",
      "./png/car3.png",
      "./png/car1.png",
    ],
    w: 50,
    h: 100,
    x: null,
    y: null,
  };

  let weatherLook = {
    snow: "./png/snow.png",
    rain: "./png/rain.png",
    clouds: "./png/cloud.png",
  };

  this.init = function (body) {
    //инициализация
    bodyV = body;
    this.renderStartPage();
  };

  this.resizeGame = function (w, h) {
    //перерисовка отображения рабочего окна
    // console.log(w, h)
    resize.w = w;
    resize.h = h;
    wrapper.style.width = resize.w + "px";
    wrapper.style.height = resize.h + "px";
  };

  this.render = function () {
    //рендер игры

    gameWrapper = document.createElement("div"); // контейнер игры
    gameWrapper.classList.add("game-wrapper");
    wrapper.append(gameWrapper);

    startMessage = document.createElement("div"); //стартовое сообщение с блоками для старта игры и ввода имени
    startMessage.classList.add("start-message");
    nameInput = document.createElement("input");
    nameInput.classList.add("name-input");
    nameInput.placeholder = "enter your name";
    message = document.createElement("button");
    message.classList.add("message");
    message.textContent = "start";
    messageSound = document.createElement("div");
    messageSound.classList.add("sound-btn");
    soundIMG = new Image();
    soundIMG.src = soundCheck[0];
    messageSound.append(soundIMG);
    gameWrapper.append(startMessage);
    messageBefore = document.createElement("span");
    messageBefore.classList.add("error");
    startMessage.append(messageBefore);
    startMessage.append(nameInput);
    startMessage.append(message);
    startMessage.append(messageSound);

    overMessage = document.createElement("div"); // блок для отображения окончания игры с возможностью перезапуска
    overMessage.classList.add("over-message");
    overMessage.classList.add("hide");
    let gameOverMSG = document.createElement("span");
    gameOverMSG.classList.add("game-over");
    gameOverMSG.innerHTML = "game over";
    overMessage.append(gameOverMSG);

    reloadMSG = document.createElement("div");
    reloadMSG.classList.add("reload-msg");
    overMessage.append(reloadMSG);

    let reloadWrapper = document.createElement("div");
    reloadWrapper.classList.add("reload-wrapper");
    reloadMSG.append(reloadWrapper);

    let reloadTxt = document.createElement("span");
    reloadTxt.textContent = "play again";

    let reloadBTN = document.createElement("div");
    reloadBTN.classList.add("reload-btn");
    let reloadIMG = new Image();
    reloadIMG.src = "./png/reload.png";
    reloadBTN.append(reloadIMG);
    reloadWrapper.append(reloadBTN);
    reloadWrapper.append(reloadTxt);
    let deleteWrapper = document.createElement("div");
    deleteWrapper.classList.add("delete-wrapper");
    reloadMSG.append(deleteWrapper);

    let deleteTxt = document.createElement("span");
    deleteTxt.textContent = "delete data";

    let deleteBTN = document.createElement("div");
    deleteBTN.classList.add("delete-btn");
    let deleteIMG = new Image();
    deleteIMG.src = "./png/delete.png";
    deleteBTN.append(deleteIMG);
    deleteWrapper.append(deleteBTN);
    deleteWrapper.append(deleteTxt);
    reloadMSG.append(deleteWrapper);
    let cancelWrapper = document.createElement("div");
    cancelWrapper.classList.add("cancel-wrapper");
    reloadMSG.append(cancelWrapper);

    let cancelTxt = document.createElement("span");
    cancelTxt.textContent = "quit";

    let cancelBTN = document.createElement("div");
    cancelBTN.classList.add("cancel-btn");
    let cancelIMG = new Image();
    cancelIMG.src = "./png/cancel.png";
    cancelBTN.append(cancelIMG);
    cancelWrapper.append(cancelBTN);
    cancelWrapper.append(cancelTxt);
    reloadMSG.append(cancelWrapper);

    gameWrapper.append(overMessage);

    deleteUserMessage = document.createElement("span");
    deleteUserMessage.classList.add("delete-message");
    deleteUserMessage.textContent = "";
    reloadMSG.after(deleteUserMessage);

    layout = document.createElement("div"); //блок с отрисовкой трассы
    layout.classList.add("layout-wrapper");
    layout.style.backgroundImage = "url(./png/layoutDress.png)";
    gameWrapper.append(layout);

    let trackWrapper = document.createElement("div"); // блок дороги
    trackWrapper.classList.add("track-wrapper");
    gameWrapper.append(trackWrapper);

    let trackWrapperIMG = document.createElement("div");
    trackWrapperIMG.classList.add("track-wrapper__img");
    layout.append(trackWrapperIMG);

    let wrapperBorderLeft = document.createElement("div");
    wrapperBorderLeft.classList.add("border-img__left");
    wrapperBorderLeft.style.backgroundImage = "url(./png/borderLeft.png)";
    trackWrapperIMG.append(wrapperBorderLeft);
    wrapperBorderLeft.style.left = 0 + "px";
    wrapperBorderLeft.style.width = 30 + "px";

    let tracks = ["./png/track.png", "./png/track.png"];
    let trackB = document.createElement("div");
    trackB.classList.add("track-img");
    trackB.style.backgroundImage = `url(${tracks[0]})`;
    trackWrapperIMG.append(trackB);

    let wrapperBorderRight = document.createElement("div");
    wrapperBorderRight.classList.add("border-img__right");
    wrapperBorderRight.style.backgroundImage = "url(./png/borderRight.png)";
    trackWrapperIMG.append(wrapperBorderRight);
    wrapperBorderRight.style.right = 0 + "px";
    wrapperBorderRight.style.width = wrapperBorderLeft.offsetWidth + "px";

    flashlight = document.createElement("div");
    flashlight.classList.add("flashlight");
    layout.append(flashlight);
    // flashlightIMG = new Image();
    // flashlightIMG.src = flashStatus[0];
    // flashlight.append(flashlightIMG);

    track = document.createElement("div"); //блок дороги для плеера и препятствий
    track.classList.add("track");
    track.style.left = wrapperBorderLeft.offsetWidth + "px";
    track.style.width = trackB.offsetWidth + "px";
    trackWrapper.append(track);

    carWrapper = document.createElement("div"); // блок плеера
    carWrapper.classList.add("car-wrapper");
    track.append(carWrapper);
    let carIMG = new Image();
    carIMG.src = "./png/car4.png";
    carWrapper.append(carIMG);
    car.x = track.offsetWidth / 2 - carWrapper.offsetWidth / 2 + "px";
    car.y = track.offsetHeight - carWrapper.offsetHeight + "px";

    let score = document.createElement("div"); // отображение текущего имени и набраных очкав
    score.classList.add("score");
    nameScore = document.createElement("span");
    nameScore.classList.add("score-name");
    nameScore.textContent = `name`;
    numberScore = document.createElement("span");
    numberScore.classList.add("score-number");
    numberScore.textContent = `0`;
    score.append(nameScore);
    score.append(numberScore);
    gameWrapper.append(score);

    layoutB = layout.cloneNode(true); // клон трассы
    gameWrapper.append(layoutB);
    flashlightB = flashlight.cloneNode(true);
    layoutB.append(flashlightB);
    layoutB.style.top = -track.offsetHeight + "px";

    objectMess = document.createElement("div"); //блок с препятствием
    objectMess.classList.add("new-mess");
    track.append(objectMess);
    objectMess.style.top = -objectMess.offsetHeight + "px";

    userListWrapper = document.createElement("div"); // блок с результатами
    userListWrapper.classList.add("user-list__wrapper");
    gameWrapper.append(userListWrapper);

    userListBTN = document.createElement("button"); // кнопка для отображения результатов
    userListBTN.classList.add("user-list__btn");
    userListBTN.innerHTML = "leaderboard";
    userListWrapper.append(userListBTN);

    userList = document.createElement("div");
    userList.classList.add("user-list");
    userList.classList.add("hide-list");
    userList.style.width = userListBTN.offsetWidth + "px";
    userListWrapper.append(userList);

    userItem = document.createElement("span");
    userItem.classList.add("user-item");
    userList.append(userItem);

    bip = new Audio("./sound/bip.mp3");
    gameWrapper.append(bip);

    backMusic = new Audio("./sound/back_sound.mp3");

    crashSound = new Audio("./sound/crash.mp3");
    raceSound = new Audio("./sound/race.mp3");
    startSound = new Audio("./sound/start.mp3");
    timerCountSound = new Audio("./sound/beeps.mp3");

    gameWrapper.append(crashSound);
    gameWrapper.append(raceSound);
    gameWrapper.append(startSound);
    gameWrapper.append(timerCountSound);

    timerCount = document.createElement("span");
    timerCount.classList.add("timer");
    gameWrapper.append(timerCount);

    lazzyLoad = document.createElement('div');
    lazzyLoad.classList.add('lazzy-load');
    wrapper.append(lazzyLoad);
    lazzyRound = document.createElement('div');
    let lazzyLoadIMG = new Image();
    lazzyLoadIMG.src = './png/tyre.png';
    lazzyRound.append(lazzyLoadIMG);
    lazzyRound.classList.add('lazzy-load__round');
    wrapper.append(lazzyRound);
  };

  this.renderTouchArrow = function () {
    //кнопки для управления на сенсорном экране
    let leftTouch = document.createElement("div");
    leftTouch.classList.add("left-touch");
    let leftIMG = new Image();
    leftIMG.src = "./png/left.png";
    leftTouch.append(leftIMG);
    gameWrapper.append(leftTouch);

    let rightTouch = document.createElement("div");
    rightTouch.classList.add("right-touch");
    let rightIMG = new Image();
    rightIMG.src = "./png/right.png";
    rightTouch.append(rightIMG);
    gameWrapper.append(rightTouch);
  };

  this.startGame = function () {
    startMessage.classList.toggle("hide");
  };

  //Отрисовка игры
  this.carController = function (x, y, deg) {
    car.cor = deg;
    if (
      x > 0 + carWrapper.offsetWidth / 5 &&
      x <
      track.offsetWidth - carWrapper.offsetWidth - carWrapper.offsetWidth / 5
    ) {
      car.x = x;
    }
    if (
      y > track.offsetTop &&
      y < track.offsetHeight - carWrapper.offsetHeight
    ) {
      car.y = y;
    }

    carWrapper.style.left = car.x + "px";
    carWrapper.style.top = car.y + "px";
    carWrapper.style.transform = `rotate(${car.cor}deg) translate(0, ${car.cor}px)`;
  };

  this.renderRoad = function (pos) {
    // обновление трассы
    //отрисовка дороги

    position = pos;

    if (layout.offsetTop > gameWrapper.offsetHeight) {
      layout.style.top = -gameWrapper.offsetHeight + position + "px";
    }

    if (layoutB.offsetTop > gameWrapper.offsetHeight) {
      layoutB.style.top = -gameWrapper.offsetHeight + position + "px";
    }

    layout.style.top = position + "px";
    layoutB.style.top = -gameWrapper.offsetHeight + position + "px";
  };

  this.overGame = function () {
    //блок для перезагрузки
    deleteUserMessage.textContent = "";
    overMessage.classList.toggle("hide");
    crashSound.pause();
  };

  this.appentIMG = function (calc) {
    //добавление изображения препятствия
    img.src = mess.object[calc];
    objectMess.append(img);
  };

  this.renderMess = function (x, y) {
    // позиционироние препятствия
    mess.y = y;
    mess.x = x;

    objectMess.style.top = -objectMess.offsetHeight + mess.y + "px";
    objectMess.style.left = mess.x + "px";
  };

  this.positionCar = function (x, y) {
    carWrapper.style.top = y + "px";
    carWrapper.style.left = x + "px";
  };

  this.pointCount = function (score) {
    // отрисовка набраных очков
    numberScore.textContent = score;
  };

  this.userName = function (userName) {
    // отрисовка имени игрока
    nameScore.textContent = userName;
  };

  this.playerError = function (userName) {
    //обработка ввода имни при старте
    let mes = null;
    if (userName) {
      mes = "user named " + userName + " already exists";
    } else {
      nameInput.style.border = "2px dashed lightsalmon";
      mes = "the field cannot be empty";
    }
    messageBefore.innerText = mes;
  };

  this.createUserList = function (i, list) {
    // отбражение списка результатов
    userItem = document.createElement("span");
    userItem.classList.add("user-item");
    userList.append(userItem);
    if (list) {
      userItem.textContent = `${list[i].name}: ${list[i].score}`;
    } else {
      userItem.innerHTML = `no data <br> available`;
    }
  };

  this.clearUserList = function () {
    // очистка списка перед обновлением
    userList.innerHTML = "";
  };

  this.openUserList = function () {
    userList.classList.toggle("hide-list");
  };

  this.checkSound = function (check) {
    //перключение звука
    let audios = document.querySelectorAll("audio");

    if (check) {
      soundIMG.src = soundCheck[0];
      for (let audio of audios) {
        // audio.play();
        audio.volume = 0.7;
        audio.autoplay = true;
      }
    } else {
      soundIMG.src = soundCheck[1];
      for (let audio of audios) {
        // audio.pause();
        audio.volume = 0;
        audio.autoplay = false;
      }
    }
  };

  this.clearRender = function () {
    // очищаем контейнер
    wrapper.innerHTML = "";
  };

  this.renderStartPage = function () {
    // верска стартовой страницы
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.classList.add("wrapper");
      bodyV.append(wrapper);
    }

    let startPage = document.createElement("div");
    startPage.classList.add("start-page");
    wrapper.append(startPage);

    let startPageCar = document.createElement("div");
    startPageCar.classList.add("start-page__car");
    let carIMG = new Image();
    carIMG.src = "./png/flag.png";
    startPageCar.append(carIMG);
    // startPageCar.style.right = '0';

    // let startPageCarB = startPageCar.cloneNode(true);
    // startPageCarB.style.transform = 'scale(-1, 1)';
    // startPageCarB.style.right = '0';
    // startPage.append(startPageCarB);
    startPage.append(startPageCar);

    let gameName = document.createElement("div");
    gameName.classList.add("start-page__name");
    let gameNameIMG = new Image();
    gameNameIMG.src = "./svg/racing3.svg";
    gameName.append(gameNameIMG);
    startPage.append(gameName);

    let startBTN = document.createElement("button");
    startBTN.classList.add("start-btn__start-page");
    startBTN.textContent = "Start Game";
    startPage.append(startBTN);

    startPageArrow = document.createElement("div");
    startPageArrow.classList.add("start-page__arrow");
    arrowIMG = new Image();
    arrowIMG.src = "./png/arrow.png";
    descriptionArrow = document.createElement("div");
    descriptionArrow.classList.add("start-page__arrow-description");
    // descriptionArrow.textContent = 'управление осуществляется посредствам клавишь со стрелками';
    startPageArrow.append(descriptionArrow);
    startPageArrow.append(arrowIMG);
    startPage.append(startPageArrow);
  };

  this.deleteUser = function () {
    // сообщение при удалении данных пользователя
    deleteUserMessage.textContent = "user deleted";
  };

  this.gameViewTouch = function () {
    //замена картинки для сенсорных дисплеев
    descriptionArrow.textContent = "";
    arrowIMG.src = "./png/touch.png";
  };

  this.soundClick = function (check) {
    //звук при клике на объекты
    bip.play();
  };

  this.crash = function (check) { //звук столкновения
    if (check) {
      crashSound.play();
    } else {
      crashSound.pause();
    }
  };

  this.startCarSound = function (check) {
    if (check) {
      startSound.play();
    } else {
      startSound.pause();
    }
  };

  this.raceCarSound = function (check) { //звук машины
    // console.log(check);
    if (check) {
      raceSound.play();
      raceSound.loop = true;
    } else {
      raceSound.pause();
      raceSound.loop = false;
    }
  };

  this.timerCount = function (count) {
    // таймер перед стартом игры
    timerCount.textContent = count;
    timerCountSound.play();
  };

  this.restoreUser = function (userName) { //вывод имени из локального хранилища
    let nameInput2 = document.createElement("span");
    nameInput2.classList.add("restore-user");
    nameInput2.textContent = `hi, ${userName}`;
    startMessage.replaceChild(nameInput2, nameInput);
  };

  this.timesOfDay = function (night) { //перключение времени суток
    if (night) {
      let dimmingLayout = document.createElement("div");
      dimmingLayout.classList.add("layout-wrapper__dimming");
      layout.append(dimmingLayout);
      let dimmingLayoutB = dimmingLayout.cloneNode(true);
      layoutB.append(dimmingLayoutB);

      flashlightIMG = new Image();
      flashlightIMG.src = flashStatus[0];
      flashlight.append(flashlightIMG);
      let flashlightB = flashlight.cloneNode(true);
      layoutB.append(flashlightB);
    } else {
      flashlightIMG = new Image();
      flashlightIMG.src = flashStatus[1];
      flashlight.append(flashlightIMG);
      let flashlightB = flashlight.cloneNode(true);
      layoutB.append(flashlightB);
    }
  };

  this.renderPrecipitation = function (rand, weather, i) { //погодные условия
    console.log(weather)
    if (weather === "rain" || weather === "snow" || weather === "clouds") {
      let drop = document.createElement("div");
      drop.classList.add("precipitation");
      switch (weather) {
        case "snow":
          drop.style.width = "15px";
          drop.style.animation = "precip 5s linear infinite";
          break;
        case "rain":
          drop.style.width = "3px";
          drop.style.animation = "precip 1.2s linear infinite";
          break;
        // case 'clouds':
        //   drop.style.width = '100px';
        //   drop.style.height = '100px';
        //   drop.style.animation = 'precip 5s linear infinite';
        // break;
      }

      let dropIMG = new Image();
      dropIMG.src = weatherLook[weather];
      drop.append(dropIMG);
      gameWrapper.append(drop);
      drop.style.height = "15px";
      drop.style.top = "-50px";
      drop.style.animationDelay = `${0.03 * i}s`;
      drop.style.left = `${rand}px`;
    }
    // if(drop.offsetTop > gameWrapper.offsetHeight){
    //   drop.remove();
    // }
  };

  this.lazzyStatus = function () { // отключение анимации загрузки
    lazzyLoad.remove();
    lazzyRound.remove();
    if (lazzyError) {
      lazzyError.remove();
    }
  };

  this.weatherSettingsError = function (net) { //вывод ошибки подключения
    lazzyRound.remove();
    lazzyError = document.createElement('div');
    lazzyError.classList.add('lazzy-error__text');
    wrapper.append(lazzyError);

    if (!net) {
      lazzyError.innerHTML = `<span>no internet connection or databases unavailable</span> <div class = "lazzy-load__btn">OK</div>`;
    }
  };

  this.fullScreen = function (screen) {
    // console.log(screen.name)
    switch (screen.name) {
      case 'requestFullScreen':
        wrapper.requestFullScreen();
        break;
      case 'mozRequestFullScreen':
        wrapper.mozRequestFullScreen();
        break;
      case 'webkitRequestFullScreen':
        wrapper.webkitRequestFullScreen();
        break;
    }
  };
}
