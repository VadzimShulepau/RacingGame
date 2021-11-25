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
  let curentTimeHours = new Date().getHours();
  
  this.init = function (view, data) {
    //инициализация верстки
    viewM = view;
    database = data;
  };

  this.parametres = function (tr, gw) {
    //данные для перерасчета
    track = tr;
      // console.log(track)
    car.x = track.offsetWidth / 2 - car.w / 2;
    car.y = track.offsetHeight - car.h;
    height = gw;
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
      // viewM.startGame();
      
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
        viewM.positionCar(track.offsetWidth / 2 - car.w / 2, track.offsetHeight - car.h);
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
    if (car.y < mess.y && car.y + car.h > mess.y) {
      this.pointCount();
      if (car.x < mess.x + mess.w && car.x + car.w > mess.x) {
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
        console.log("Пользователь добавлен");
      })
      .catch(function (error) {
        console.error("Ошибка добавления пользователя: ", error);
      });

    this.readJSON();
  };

  this.readJSON = () => {
    //вычитка данных с сервера
    database.ref("users/").on(
      "value",
      (snapshot) => {
          sortList = Object.values(snapshot.val());
      },
      (error) => {
        // console.log("Error: " + error.code);
        this.createUserListError();
      }
    );
  };

  this.createUserList = function () {
    // обработка данных содание списка для отображения

    viewM.clearUserList();
    this.readJSON();
    // console.log(sortList, dataBaseUsers)
    if (sortList) {
      sortList.sort(function (a, b) { //сортировка списка по убыванию
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
    window.localStorage.removeItem('user');
    database
      .ref("users/" + user.name)
      .remove()
      .then(() => {
        console.log("Данные удалены");
        this.createUserList();
        // this.writeJSON();
        // this.readJSON();
        viewM.deleteUser();
      })
      .catch(function (error) {
        console.error("Ошибка удаления данных: ", error);
      });
      
  };

  this.openUserList = function () {
    //открытие окна со списком результатов
    this.readJSON();
    this.createUserList();
    viewM.openUserList();
  };

  this.checkDataBaseUser = function (name){
    if(name && name !== "null"){
    let trueItem = [];
    for (let i in sortList){
      if(sortList[i].name === name){
        trueItem.push(sortList[i].name);
      }
    }
    if(trueItem[0] === name){
      viewM.playerError(name);
    }else{
      this.userName(name);
      this.startGameOnRestore();
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  }else{
    viewM.playerError(name);
  }
  };

  this.restoreSettings = function () {
    //востановление настроек из локальной памяти
      let userStore = window.localStorage.getItem("user");
      if (userStore) {
        user = JSON.parse(userStore);
        viewM.checkSound(user.sound);
        if(user.name){
          viewM.restoreUser(user.name);
          viewM.userName(user.name);
          // viewM.startGame(); 
        }
      }
  };

  this.startGameOnRestore = function (){ // start game
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
    this.readJSON();
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

  this.timerCount = function (){
    // таймер перед стартом игры
    if(timer >= count){
      timer -= count;
      viewM.timerCount(timer);
      if(timer < count){
        viewM.timerCount('GO');
      }
    }else{
      clearInterval(intervalTimer);
      viewM.timerCount('');
      timer = 4;
    }
  };

  this.generatePosition = function (position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
   console.log(lat, lon)
  };

  this.weatherSettings = function (){

  };
}