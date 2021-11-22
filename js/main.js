const ConnectGame = (function(){
    const firebaseConfig = {
      apiKey: "AIzaSyDTtJiobdJ_OYV0FwYxaH-vZzPtokbjLS4",
      authDomain: "racinggame-650a7.firebaseapp.com",
      databaseURL: "https://racinggame-650a7-default-rtdb.firebaseio.com",
      projectId: "racinggame-650a7",
      storageBucket: "racinggame-650a7.appspot.com",
      messagingSenderId: "549650234423",
      appId: "1:549650234423:web:11a3ea193816cea885d3b2",
    };
    // firebase.initializeApp(firebaseConfig);
    // const database = firebase.database();

return {
  initGame: function (body){
    // const body = document.querySelector("body");
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const gameView = new GameView();
    const gameModel = new GameModel();
    const gameController = new GameController();
    gameView.init(body);
    gameModel.init(gameView, database);
    gameController.init(body, gameModel);

  },
}
})();
new ConnectGame.initGame(document.querySelector('body'));