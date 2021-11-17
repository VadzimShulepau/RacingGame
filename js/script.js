  
    window.addEventListener('beforeunload', this.forceExit);
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
        )
        ) {
          console.log("Вы используете мобильное устройство (телефон или планшет).");
        } else console.log("Вы используете ПК.");