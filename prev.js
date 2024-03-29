//t controller
var budgetController = (function () {
  //everytime new item is created 
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum = sum + cur.value;

    });
    data.totals[type] = sum;

  };



  var data = {
    allItems: {
      exp: [],
      inc: []

    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentge: -1



  };


  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      ID = 0;

      //create new ID
      if (data.allItems[type].length > 0)
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      else
        ID = 0;
      /// create new item based on inc or exp
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val)

      }

      //push into our data strcture
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      //calculate the budget : income  - expenses
      data.budget = data.totals.inc - data.totals.exp;

      if(data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
        data.percentage = -1; // meaning its non existant 
    }
      //calculate the percentge of income that we spent 
    },
    //return it 
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };

    }


  };


})();


//UIcontroller
var UIController = (function () {

  var DOMstrings = {

    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'
  };


  

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp.
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;

      // create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> '
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = ' <div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      //replace placeholder text with actual data

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //insert the html
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function () {
      var fields;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {

        current.value = "";



      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {


        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;


      } else {

        document.querySelector(DOMstrings.percentageLabel).textContent = '----';
      }

    },
    getDOMstrings: function () {
      return DOMstrings;


    }
  };

})();

//GLobal controller
var Controller = (function (UICtrl, budgetctrl) {

  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });




  }


  var updateBudget = function () {
    //1. calculate the budget
    budgetctrl.calculateBudget();
    //2.return the budget
    var budget = budgetctrl.getBudget();

    //3.display in UI
    

  };

  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get Input
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0)

    {

      // 2. add item to budget controller
      newItem = budgetctrl.addItem(input.type, input.description, input.value);


      // 3. add item on UI
      UICtrl.addListItem(newItem, input.type);
      //4.clear the fields

      UICtrl.clearFields();

      //5.calculate and display budget on UI

      updateBudget();
    }

  };
  return {
    init: function () {
      console.log('Application has started.');
      UICtrl.displayBudget({
        
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
          
       } );
      setupEventListeners();
      
    }
  }


})(UIController, budgetController);
Controller.init();