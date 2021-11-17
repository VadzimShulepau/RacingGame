function GameController() {
  let wrapperC = null;
  let modelC = null;
  let track = null;
  let gameWrapper = null;
  let nameInput = null;
  let touchDevice = null;
  let startBTN = null;
  var ldelay;
  var betw={};

  let key = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRigth: false,
  };
  let nameUser = null;

  this.init = function (body, model) {
    wrapperC = body;
    modelC = model;

    window.addEventListener("resize", this.resizeGame); // размер рабочего окна
    // this.forceExit();
    this.resizeGame();

    startBTN = wrapperC.querySelector(".start-btn__start-page");
    touchDevice = "ontouchstart" in window; // проверяем является ли устройство сенсороным
    if (touchDevice) {
      modelC.gameViewTouch();
    }
    startBTN.addEventListener("click", this.loadStartMessage);
  };

  this.loadStartMessage = (e) => {
    e.preventDefault();

    modelC.loadStartMessage();//загрружаем основную игру

    this.initRenderPage();
  };

  this.initRenderPage = function () {
    this.resizeGame();

    track = wrapperC.querySelector(".track"); // блок с дорогой
    gameWrapper = wrapperC.querySelector(".game-wrapper"); // контейнер с игрой
    nameInput = wrapperC.querySelector(".name-input"); // ввод имени
    wrapperC.addEventListener("click", this.clickButton);
    if (touchDevice) {
    modelC.renderTouchArrow();
      this.initTouchUsage();
    }else{
      this.initKeyUsage();
    }
    if (window.localStorage) {
      // проверяем есть ли сохраненные настройки в локальном хранилище
      modelC.restoreSettings(true);
    }

    modelC.soundCheckSettingsStart();

  };

  this.resizeGame = () => {
    let clientWidth = document.body.clientWidth;
    let clientHeight = document.body.clientHeight;
    // let clientWidth = window.innerWidth;
    // let clientHeight = window.innerHeight;
    modelC.resizeGame(clientWidth, clientHeight);

  };

  this.initKeyUsage = function () {
    //обработка нажатия клавишь

    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  };

  this.clickButton = function (e) {
    e.preventDefault();
    // console.log(e.target)
    if (e.target.closest(".message")) {
      nameUser = nameInput.value;
      modelC.userName(nameUser);
      modelC.parametres(track, gameWrapper.offsetHeight);
    }
    if (e.target.closest(".reload-btn")) {
      modelC.parametres(track, gameWrapper.offsetHeight);
      modelC.reloadGame();
    }
    if (e.target.closest(".user-list__btn")) {
      modelC.openUserList();
    }
    if (e.target.closest(".sound-btn")) {
      modelC.checkSound();
    }
    if (e.target.closest(".cancel-btn")) {
      modelC.closeGame();
      if (touchDevice) {modelC.gameViewTouch()};
    }
    if (e.target.closest(".delete-btn")) {
      modelC.deleteUser();
    }

    modelC.soundClick();
  };

  this.initTouchUsage = function () {
    // обработка касаний
    let left = document.querySelector('.left-touch');
    let right = document.querySelector('.right-touch');
   left.addEventListener('touchstart', this.startTouch, false);
   left.addEventListener('touchend', this.endTouch, false);
   right.addEventListener('touchstart', this.startTouch, false);
   right.addEventListener('touchend', this.endTouch, false);

  };

  this.keydownHandler = function (e) {
    switch (e.code) {
      case "ArrowUp":
        key.arrowUp = true;
        break;
      case "ArrowDown":
        key.arrowDown = true;
        break;
      case "ArrowLeft":
        key.arrowLeft = true;
        break;
      case "ArrowRight":
        key.arrowRigth = true;
        break;
    }

    modelC.carController(key);
  };

  this.keyupHandler = function (e) {
    switch (e.code) {
      case "ArrowUp":
        key.arrowUp = false;
        break;
      case "ArrowDown":
        key.arrowDown = false;
        break;
      case "ArrowLeft":
        key.arrowLeft = false;
        break;
      case "ArrowRight":
        key.arrowRigth = false;
        break;
    }

    if(e.target.closest('.left-touch')){
      key.arrowLeft = false;
    }
    if(e.target.closest('.right-touch')){
      key.arrowRigth = false;
    }

    modelC.carController(key);
  };


  this.forceExit = function (){
    var hook = true;
    window.onbeforeunload = function() {
      if (hook) { 
        return "Did you save your stuff?" 
      }
    }
    function unhook() { 
      hook=false; 
    }
  };


  this.startTouch = function (e) {
    e.preventDefault();
    e.stopPropagation();
   if(e.target.closest('.left-touch')){

     key.arrowLeft = true;
   }
   if(e.target.closest('.right-touch')){
     key.arrowRigth = true;
   }
    
    modelC.carController(key);
};

  this.endTouch = function (e) {
    e.preventDefault();
    e.stopPropagation();

key.arrowLeft = false;
key.arrowRigth = false;

modelC.carController(key);
};


}
