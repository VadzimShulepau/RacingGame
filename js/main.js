
 const firebaseConfig = {
   apiKey: "AIzaSyDTtJiobdJ_OYV0FwYxaH-vZzPtokbjLS4",
   authDomain: "racinggame-650a7.firebaseapp.com",
   databaseURL: "https://racinggame-650a7-default-rtdb.firebaseio.com",
   projectId: "racinggame-650a7",
   storageBucket: "racinggame-650a7.appspot.com",
   messagingSenderId: "549650234423",
   appId: "1:549650234423:web:11a3ea193816cea885d3b2"
  };
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  const body = document.querySelector('body');
  const gameView = new GameView();
  const gameModel = new GameModel();
  const gameController = new GameController();
  gameView.init(body);
  gameModel.init(gameView);
  gameController.init(body, gameModel);
