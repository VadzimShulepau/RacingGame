import { GameView } from "./GameView.js";
import { GameModel } from "./GameModel.js";
import { GameController } from "./GameController.js";

const ConnectGame = (function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDTtJiobdJ_OYV0FwYxaH-vZzPtokbjLS4",
    authDomain: "racinggame-650a7.firebaseapp.com",
    databaseURL: "https://racinggame-650a7-default-rtdb.firebaseio.com",
    projectId: "racinggame-650a7",
    storageBucket: "racinggame-650a7.appspot.com",
    messagingSenderId: "549650234423",
    appId: "1:549650234423:web:11a3ea193816cea885d3b2",
  };

  return {
    version: 'version: 0.1',
    initGame: function (body) {
      this.main();
     let database;
      if(typeof firebase === 'object'){
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
      }else{
        database = null;
      }
      // firebase.initializeApp(firebaseConfig);
      // const database = firebase.database();
      const gameView = new GameView();
      const gameModel = new GameModel();
      const gameController = new GameController();
      gameView.init(body);
      gameModel.init(gameView, database);
      gameController.init(body, gameModel);

    },
    main: function () {
      console.log(`racing game ${this.version}`);
    }
  }
})();
ConnectGame.initGame(document.querySelector('body'));