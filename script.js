var filmController = (function() {
    //This module is responsible for adding films

    var Film = function(id, title, director, year) {
        this.id = id;
        this.title = title;
        this.director = director;
        this.year = year;
    };

    var allFilms = [];

    return {
        addItem: function(fTitle, fDirector, fYear) {
            var newItem, ID;

            // Create an ID for film
            if (allFilms.length > 0) {
                ID = allFilms[allFilms.length - 1].id + 1;
            } else {
                ID = 0;
            };

            // Create new item
            newItem = new Film(ID, fTitle, fDirector, fYear);

            // Push it into films storage
            allFilms.push(newItem);
            
            // Return the new element
            console.log(allFilms); // FOR TESTING PURPOSES
            return newItem;
        },
    };

})();

var UIController = (function() {
    //This module is responsible for user interface

    var DOMstrings = {
        // All strings used in app
        inputTitle: '.add__title',
        inputDirector: '.add__director',
        inputYear: '.add__year',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                title: document.querySelector(DOMstrings.inputTitle).value,
                director: document.querySelector(DOMstrings.inputDirector).value,
                year: document.querySelector(DOMstrings.inputYear).value,

            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


var controller = (function(filmCtrl, UICtrl) {
    //This module is responsible for communication between filmController and UIController
    

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    };    

    var ctrlAddItem = function() {
    var input, newItem;
        
        //1. Get input data
        input = UICtrl.getInput();

        //2. Add item to filmController
        newItem = filmController.addItem(input.title, input.director, input.year);
    };
    
    return {
        init: function() {
            setupEventListeners();
        },
    };

})(filmController, UIController);

controller.init();

/*
film[title]
film[director]
film[year]
*/