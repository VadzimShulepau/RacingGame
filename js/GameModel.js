function GameModel() {
  let sIndex = 0.1;
  let viewM = null;
  let key = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRigth: false,
  };
  let status = false;
  let animation;
  let animationGame;
  let track = null;
  let exit = false;
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
  let position = 0;
  let max = null;

  let sortList = null;

  let user = {
    name: "Имя",
    score: 0,
    sound: true,
  };
  let timerInterval;
  let count = 3;

  this.init = function (view) {
    //инициализация верстки
    viewM = view;
  };

  this.parametres = function (tr, gw) {
    //данные для перерасчета
    track = tr;
    //   console.log(track)
    car.x = track.offsetWidth / 2 - car.w / 2;
    car.y = track.offsetHeight - car.h;
    height = gw;
    max = track.offsetWidth - mess.w;
  };

  this.resizeGame = function (w, h) {
    //перерасчет размеров рабочего окна
    console.log(w, h);
    let clientWidth = w;
    let clientHeight = h;
    viewM.resizeGame(clientWidth, clientHeight);
  };

  this.userName = function (us) {
    // передача имени и запуск игры
    if (us) {
      status = true;
      this.gameStatus(status);
      user.name = us;
      viewM.userName(us);
    } else {
      viewM.playerError(us);
    }
    console.log(user.name);
  };

  this.gameStatus = function (start) {
    // установка таймера и интервала/сброс настроек после перезапуска

    status = start;
    if (status) {
      viewM.startGame();

      if (user.sound) {
        viewM.startCarSound(true);
      }

      viewM.appentIMG(this.calcNumber());
      setTimeout(() => {
        this.statusAnimation();
        if (user.sound) {
          viewM.raceCarSound(true);
        }
      }, 2000);
    } else {
      viewM.raceCarSound(false);
      clearInterval(animationGame);
      car.speed = 9;
      mess.y = -car.h;
      viewM.overGame();
      setTimeout(function () {
        viewM.renderMess(mess.x, mess.y);
      }, 1000);
    }
  };

  this.statusAnimation = function () {
    // инициализация интервала
    animationGame = setInterval(() => {
      this.carController(key);
      this.renderRoad();
      this.renderMess();
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
    this.colide();
  };

  this.colide = function () {
    //коализии
    if (car.y < mess.y && car.y + car.h > mess.y) {
      this.pointCount();
      if (car.x < mess.x + mess.w && car.x + car.w > mess.x) {
        console.log(user.name + "1");
        this.gameStatus(false);
        this.writeJSON();
        if (user.sound) {
          viewM.crash(true);
        }
        // viewM.raceCarSound(false);
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
        console.log("Пользователь добавлен");
      })
      .catch(function (error) {
        console.error("Ошибка добавления пользователя: ", error);
      });

    this.readJSON();
    user.score = 0;
  };

  this.readJSON = function () {
    //вычитка данных с сервера
    //  database.ref("users/").on("value", this.createUserList);
    database.ref("users/").on(
      "value",
      (snapshot) => {
        this.createUserList(snapshot.val());
      },
      (error) => {
        console.log("Error: " + error.code);
        this.createUserListError();
      }
    );
  };

  this.createUserList = function (snap) {
    // обработка данных содание списка для отображения

    viewM.clearUserList();
    if (snap) {
      sortList = Object.values(snap);
      sortList.sort(function (a, b) {
        return b.score - a.score;
      });
      for (let i in sortList) {
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
    database
      .ref("users/" + user.name)
      .remove()
      .then(function () {
        console.log("Данные удалены");
        viewM.deleteUser();
      })
      .catch(function (error) {
        console.error("Ошибка удаления данных: ", error);
      });
    this.readJSON();
  };

  this.openUserList = function () {
    //открытие окна со списком результатов
    this.readJSON();
    viewM.openUserList();
  };

  this.restoreSettings = function (sound) {
    //востановление настроек из локальной памяти
    if (sound) {
      let userStore = window.localStorage.getItem("user");
      if (userStore) {
        user = JSON.parse(userStore);
        viewM.checkSound(user.sound);
      }
    }
  };

  this.reloadGame = function () {
    // перезагрузка гонки
    //перзагрузка игры
    start = false;
    // console.log('reload')
    viewM.overGame();
    viewM.startGame();
    viewM.startCarSound(true);
  };

  this.closeGame = function () {
    //перход на первую страницу
    //   console.log('close')
    viewM.clearRender();
    viewM.renderStartPage();
  };

  this.loadStartMessage = function () {
    //рендер игры
    //   console.log('click')
    viewM.clearRender();
    viewM.render();
  };

  this.gameViewTouch = function () {
    viewM.gameViewTouch();
  };

  this.soundClick = function () {
    if (user.sound) {
      viewM.soundClick();
    }
  };
  this.renderTouchArrow = function () {
    viewM.renderTouchArrow();
  };

  this.soundCheckSettingsStart = function () {
    viewM.raceCarSound(false);
    viewM.crash(false);
    viewM.startCarSound(true);

  };
}
