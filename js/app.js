$(function() {

    $(document).ready(function() {
        //variable //zmienne
        var row = 3;
        var col = 6;
        var divSizeWidth = '200px';
        var divSizeHeight = '180px';
        var size = row * col;
        var body = $('body');
        var game = $('#game');
        var imgFaces = [
            'images/918.png',
            'images/chiron.png',
            'images/laf.png',
            'images/one77.png',
            'images/lykan.png',
            'images/p1.png',
            'images/rimac.png',
            'images/egg.png',
            'images/veneno.png'
        ];
        //Merge the contents of two arrays together into the first array (total 18 images)
        // łączę dwie tablice w jedną, dzięki temu wyszukuje spośród 18 elementów
        var imgRandomArr = $.merge(imgFaces, imgFaces);
        var outerDiv = $('<div>'); // container for images
        //tworzenie planszy
        outerDiv.height(row * divSizeHeight).width(col * divSizeWidth); // container size
        for (var i = 0; i < size; i++) { // loop for add images to container
            var randomImg = Math.floor(Math.random() * imgRandomArr.length); //shuffle img in container
            var carImg = imgRandomArr[randomImg];
            // Remove from faces array so we don't re-pick
            imgFaces.splice(randomImg, 1);
            //set atribute and data
            var div = $('<div>').attr('data-index', i).data('imgName', carImg);
            div.addClass('block');
            outerDiv.append(div);
            var faceUp = $('<div>').addClass('face-up');
            var faceDown = $('<div>').addClass('face-down');
            div.append(faceUp);
            div.append(faceDown);
            faceUp.css({
                'background-image': 'url(' + carImg + ')'
            });
        }
        game.append(outerDiv); // add container to game

        //zmienne dla timera
        var gameScore = $(".score-game");
        var timer = $("#timer");
        gameScore.html("0 seconds");
        var score = 0;
        var hasGameStarted = false;

        //flip over the cards
        var numFlipped = 0;
        var cards = $('.block');
        //variable with last card index(data i)
        //zmienna przechowująca index ostatniego klikniętego zdjęcia
        var lastCardClick = null;
        //variable for setTimeout
        var timeout = null;
        //zmiena dla tablicy podsumowującej grę
        var resultBoard = $('#result-board');
        var statsGame = $('#stats-game');
        var footer = $('footer');

        //timer function
        function countdownTimer() {
            if (hasGameStarted !== true) {
                scoreTimeout = setInterval(function() {
                    gameScore.html(++score + " seconds");
                }, 1000);
                hasGameStarted = true;
            }
        }



        // domyślnie tablica z wynikiem jest ukryta
        resultBoard.hide();

        //funckja sprawdza czy tablica z kartami jest pusta, jesli tak wyswietla tablice z wynikiem i mozliwoscią wznowienia gry
        function endGame() {
            if (cards.filter('.hide').length === size) {
                game.hide();
                statsGame.hide();
                footer.hide();
                setTimeout(function() {
                    resultBoard.show().addClass('animated zoomIn');
                }, 200);
                clearTimeout(scoreTimeout);
            }
        }

        cards.on('click', function() {
            countdownTimer();
            // jesli ostanie klikniete zdjecie jest takie samo, nie działa timeout i nie zlicza kliknięć
            if (lastCardClick === $(this).data('index') || timeout != null) {
                return;
            }
            //zmienna przechowująca nazwę klikniętego elementu
            var lastCardElement = $('[data-index="' + lastCardClick + '"]');
            var thisCard = $(this);
            numFlipped++;

            if (numFlipped <= 2) {
                //jeśli mniejsze równe 2 kliknięcią -nadaje klasę i animację
                if (!thisCard.hasClass('visible')) {
                    thisCard.addClass('visible animated flipInY');
                    if (numFlipped === 2) { // jesli nazwa kliknietych elementów taka sama to ukryj je
                        timeout = setTimeout(function() {
                            if (lastCardElement.data('imgName') === thisCard.data('imgName')) {
                                thisCard.addClass('hide');
                                lastCardElement.addClass('hide');
                                endGame();
                            }
                            //jesli nie, odwróć karty
                            cards.removeClass('visible animated flipInY');
                            //zerowanie licznikow
                            numFlipped = 0;
                            lastCardClick = null;
                            timeout = null;
                        }, 800); //opóźnienie
                    }
                }
            }
            lastCardClick = thisCard.data('index');
        });

    });

});
