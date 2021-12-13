export function GameModel() {
  let sIndex = 0.1;
  let viewM = null;
  let key = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRigth: false,
  };
  let status = false;
  let animationGame;
  let track = null;
  // let exit = false;
  let car = {
    speed: 9,
    cor: 0,
    deg: 1,
    h: 100,
    w: 50,
    x: 0,
    y: 0,
  };
  let mess = {
    w: car.w,
    h: car.h,
    x: 0,
    y: 0,
  };
  let height = null;
  let width = null;
  let from = -width;
  let to = width;
  let position = 0;
  let max = null;
  let sortList = null;
  let user = {
    name: null,
    score: 0,
    sound: true,
  };
  let intervalTimer;
  let count = 1;
  let timer = 4;
  let database = null;
  let curentTime = new Date();
  const APIkey = "c6be1bfbfa6894d1345f3402fccb7d26";
  let exclude = "hourly,minutely";
  let weather = null;
  let netStatus = true;

  this.init = function (view, data) {
    //инициализация верстки
    viewM = view;
    if (typeof data === 'object') {
      database = data;
    } else {
      database = null;
    }

  };

  this.parametres = function (tr, gw) {
    //данные для перерасчета
    track = tr;
    car.x = track.offsetWidth / 2 - car.w / 2;
    car.y = track.offsetHeight - car.h;
    height = gw.offsetHeight;
    width = gw.offsetWidth;
    max = track.offsetWidth - mess.w;
  };

  this.resizeGame = function (w, h) {
    //перерасчет размеров рабочего окна
    // console.log(w, h);
    let clientWidth = w;
    let clientHeight = h;
    viewM.resizeGame(clientWidth, clientHeight);
  };

  this.userName = (us) => {
    // передача имени
    user.name = us;
    viewM.userName(user.name);
    // console.log(user.name);
  };

  this.gameStatus = function (start) {
    // установка таймера и интервала/сброс настроек после перезапуска

    status = start;
    if (status) {
      intervalTimer = setInterval(this.timerCount, 1000);
      if (user.sound) {
        viewM.startCarSound(true);
      }
      viewM.appentIMG(this.calcNumber());
      setTimeout(() => {
        viewM.startCarSound(false);
        this.statusAnimation();
        if (user.sound) {
          viewM.raceCarSound(true);
        }
      }, 5000);
    } else {
      viewM.raceCarSound(false);
      clearInterval(animationGame);
      // timer = 5;
      car.speed = 9;
      mess.y = -car.h;
      viewM.overGame();
      setTimeout(() => {
        viewM.renderMess(mess.x, mess.y);
        viewM.positionCar(
          track.offsetWidth / 2 - car.w / 2,
          track.offsetHeight - car.h
        );
      }, 1000);
    }
  };

  this.statusAnimation = function () {
    // инициализация интервала
    animationGame = setInterval(() => {
      this.carController(key);
      this.renderRoad();
      this.renderMess();
      this.colide();
    }, 1000 / 60);
  };

  this.carController = function (keys) {
    // управление
    key = keys;

    if (key.arrowLeft) {
      car.x -= car.speed;
      car.cor -= car.deg;
    }
    if (key.arrowRigth) {
      car.x += car.speed;
      car.cor += car.deg;
    }
    if (key.arrowUp) {
      car.y -= car.speed;
    }
    if (key.arrowDown) {
      car.y += car.speed;
    }
    if (key.arrowDown && key.arrowLeft) {
      car.cor += car.deg;
    }
    if (key.arrowDown && key.arrowRigth) {
      car.cor -= car.deg;
    }
    if (!key.arrowLeft && !key.arrowRigth && !key.arrowDown && !key.arrowUp) {
      car.cor = 0;
    }
    viewM.carController(car.x, car.y, car.cor);
  };

  this.renderRoad = function () {
    //рендер дороги
    position += car.speed;
    if (position > height) {
      position = 0;
    }
    viewM.renderRoad(position);
  };

  this.calcNumber = function () {
    //случайное число для выбора помехи
    return Math.floor(Math.random() * 4);
  };

  this.calcPosition = function (max) {
    // случайное число для позиционирования помехи по оси Х
    return Math.floor(Math.random() * max);
  };

  this.renderMess = function () {
    //создание помехи
    mess.y += car.speed;
    if (mess.y > track.offsetHeight + mess.h) {
      this.calcNumber();
      viewM.appentIMG(this.calcNumber());
      mess.y = -mess.h;
      mess.x = this.calcPosition(max);
    }
    viewM.renderMess(mess.x, mess.y);
  };

  this.colide = function () {
    //коализии
    if (car.y > mess.y - mess.h && car.y < mess.y) {
      this.pointCount();
      if (car.x < mess.x + mess.w && car.x > mess.x - mess.w) {
        // console.log(car.x, car.y, mess.x, mess.y)
        this.gameStatus(false);
        this.writeJSON();
        // this.readJSON();
        this.createUserList();

        if (user.sound) {
          viewM.crash(true);
        }
      }
    }
  };

  this.pointCount = function () {
    //зачет очков и увеличеие скорости
    user.score += 1;
    car.speed += sIndex;
    viewM.pointCount(user.score);
  };

  this.checkSound = function () {
    //переключение настроек звука
    // console.log('check')
    user.sound = user.sound ? false : true;
    viewM.checkSound(user.sound);
    window.localStorage.setItem("user", JSON.stringify(user));
  };

  this.writeJSON = function () {
    //вычитка и запись данных на сервер
    //   console.log(user.name)
    database
      .ref("users/" + `${user.name.replace(" ", "_").toLowerCase()}`)
      .set(user)
      .then(function () {
        console.log("user added");
      })
      .catch(function (error) {
        console.error("User adding error: ", error);
      });

    this.readJSON();
  };

  this.readJSON = () => {
    //вычитка данных с сервера
    if (typeof database === 'object' && database != 'null') {
      database.ref("users/").on(
        "value",
        (snapshot) => {
          sortList = Object.values(snapshot.val());
        },
        (error) => {
          console.log("Error: " + error.code);
          this.createUserListError();
        }
      );
    }
  };

  this.createUserList = function () {
    // обработка данных содание списка для отображения
    viewM.clearUserList();
    this.readJSON();
    if (sortList) {
      sortList.sort(function (a, b) {
        //сортировка списка по убыванию
        return b.score - a.score;
      });
      // let numberPlayers = sortList.length > 15 ? 15: sortList.length; // отображение максимум 15 из списка
      for (let i = 0; i < 15 && i < sortList.length; i++) {
        viewM.createUserList(i, sortList);
      }
    } else {
      this.createUserListError();
    }
  };

  this.createUserListError = function () {
    viewM.createUserList(null, null);
  };

  this.deleteUser = function () {
    window.localStorage.removeItem("user");
    database
      .ref("users/" + user.name)
      .remove()
      .then(() => {
        console.log("data deleted");
        this.createUserList();
        // this.writeJSON();
        // this.readJSON();
        viewM.deleteUser();
      })
      .catch(function (error) {
        console.error("data deletion error: ", error);
      });
  };

  this.openUserList = function () {
    //открытие окна со списком результатов
    this.readJSON();
    this.createUserList();
    viewM.openUserList();
  };

  this.checkDataBaseUser = function (name) { //валидация имени
    if (name && name !== "null") {
      let trueItem = [];
      for (let i in sortList) {
        if (sortList[i].name === name) {
          trueItem.push(sortList[i].name);
        }
      }
      if (trueItem[0] === name) {
        viewM.playerError(name);
      } else {
        this.userName(name);
        this.startGameOnRestore();
        window.localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      viewM.playerError(name);
    }
  };

  this.restoreSettings = function () {
    //востановление настроек из локальной памяти
    let userStore = window.localStorage.getItem("user");
    if (userStore) {
      user = JSON.parse(userStore);
      viewM.checkSound(user.sound);
      if (user.name) {
        viewM.restoreUser(user.name);
        viewM.userName(user.name);
        // viewM.startGame();
      }
    }
  };

  this.startGameOnRestore = function () {
    // start game
    status = true;
    this.gameStatus(status);
    viewM.startGame();
  };

  this.reloadGame = function () {
    // перезагрузка гонки
    //перзагрузка игры
    user.score = 0;
    viewM.pointCount(user.score);
    viewM.overGame();
    this.gameStatus(true);
    viewM.startCarSound(true);
  };

  this.closeGame = function () {
    //перход на стартовую страницу
    //   console.log('close')
    viewM.clearRender();
    viewM.renderStartPage();
  };

  this.loadStartMessage = function (net) {
    //рендер игры
    viewM.clearRender();
    viewM.render();
    this.lazzyLoadError(net);
    this.readJSON();
  };

  this.gameViewTouch = function () { //отображение сенсорных кнопок
    viewM.gameViewTouch();
  };

  this.soundClick = function () { //переключение звука
    if (user.sound) {
      viewM.soundClick();
    }
  };

  this.renderTouchArrow = function () {
    viewM.renderTouchArrow();
  };

  this.soundCheckSettingsStart = function () { //стартовая настройка звука
    viewM.raceCarSound(false);
    viewM.crash(false);
    viewM.startCarSound(true);
  };

  this.timerCount = function () {
    // таймер перед стартом игры
    if (timer >= count) {
      timer -= count;
      viewM.timerCount(timer);
      if (timer < count) {
        viewM.timerCount("GO");
      }
    } else {
      clearInterval(intervalTimer);
      viewM.timerCount("");
      timer = 4;
    }
  };

  this.getGeoPosition = (geoNavigator) => {
    if (Object.keys(geoNavigator).length > 0) {
      geoNavigator.getCurrentPosition(this.generatePosition);
    } else {
      this.generatePosition(null);
    }
  };

  this.generatePosition = (position) => { //подключение API для получения погоды
    // console.log(position)
    let lat, lon;

    if (position && position !== null) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    } else {
      lat = 53.9007;
      lon = 27.5709;
    }

    let geoloc = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${APIkey}`;

    fetch(geoloc)
      .then((response) => response.json())
      .then((data) => this.weatherSettings(data))
      .catch((error) => {
        console.log(error);
        netStatus = false;
        this.lazzyLoadError(netStatus);
      });
  };

  this.renderPrecipitation = function (from, to) { //рендер случайного числа для осадков
    let rand = Math.floor(from + Math.random() * (to + 1 - from));
    // console.log(rand)
    return rand;
  };

  this.weatherSettings = function (data) {
    //рендер погодных условий 
    //перeключение времени суток
    this.lazzyStatusFlag(); //отключение загрузки
    let dateSunrise = new Date(data.sys.sunrise * 1000);
    let dateSunset = new Date(data.sys.sunset * 1000);
    if (dateSunrise < curentTime && curentTime < dateSunset) {
      viewM.timesOfDay(false);
    } else {
      viewM.timesOfDay(true);
    }
    // console.log(data)
    weather = data.weather[0].main.toLowerCase();
    for (let i = 0; i < 200; i++) {
      viewM.renderPrecipitation(
        this.renderPrecipitation(-width, width), weather, i);
    }
  };

  this.lazzyStatusFlag = function () { //отключение загрузки
    viewM.lazzyStatus();
  };

  this.lazzyLoadError = function (net) { //вывод ошибки подключения
    netStatus = net;
    if (!netStatus) viewM.weatherSettingsError();
  };

  this.fullScreen = function (screen) {
    viewM.fullScreen(screen);
  }
}
