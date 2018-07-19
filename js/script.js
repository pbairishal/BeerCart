$(document).ready(function() {
    //--On ready
    price = 300;
    $.getJSON("http://starlord.hackerearth.com/beercraft", function(data) {
        jsonData = data;
        renderStyle();
        render(data);
    });

    $("#getMessage").on("click", function() {
        searchText();
        $('#txtSearch').val("");
    });
    $("#selectAlc").change(function() {
        sorting();
    });

    $("#select_id2").change(function() {
        filter();
    });

    $("body").on("click", ".addCart", function() {
        var x = $(this).data('index');
        $.map(jsonData, function(obj) {
            if (obj.id === x)
                addItem(obj);
        });
    });

    $("body").on("click", ".plusButton", function() {
        var x = $(this).data('index');
        $.map(jsonData, function(obj) {
            if (obj.id === x)
                addItem(obj);
        });
    });

    $("body").on("click", ".minusButton", function() {
        var x = $(this).data('index');
        $.map(myItems, function(obj) {
            if (obj.id === x)
                minusItem(obj);
        });
    });

    $(".trash").on("click", function() {
        removeCart();
    });


    //--Auto-complete
    $(function() {
        $.getJSON("http://starlord.hackerearth.com/beercraft", function(response) {
            JSON.stringify(response);
            var availableTags = $.map(response, function(el) {
                return el.name
            });
            $("#txtSearch").autocomplete({
                source: availableTags
            });
        });
    });
    // --Check for local storage data      
    sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (sessionData === null) { return; } else {
        myItems = sessionData;
        cartDetails();
        updatePrice();

    }


});

//-- print beer styles in filter button
function renderStyle() {
    var uniqueNames = [];
    for (i = 0; i < jsonData.length; i++) {
        if (uniqueNames.indexOf(jsonData[i].style) === -1) {
            uniqueNames.push(jsonData[i].style);
        }
    }
    var text = "";
    text += "<option hidden>Filter by Beer Style:</option>";
    for (i = 0; i < uniqueNames.length; i++) {
        text += "<option value='" + uniqueNames[i] + "'>" + uniqueNames[i] + "</option>";
    }
    $("#select_id2").html(text);
}


//-- print json data in menu
function render(data) {
    var html = "";
    data.forEach(function(val) {
        html += "<div class='col-md-6 col-lg-6 col-xs-12 col-sm-12'><div class='data img-rounded col-lg-12'>";
        html += "<img class='resimg img-rounded' src='http://webmaster.ypsa.org/wp-content/uploads/2012/08/no_thumb.jpg' alt='sample image' height='240' width='225'>";
        html += '<h3><strong>' + val.name + '</strong></h3>';
        html += "<h5 style='color:grey;'>" + val.style + "</h5><hr>";
        var alcohol = val.abv * 100;
        html += "<h4 style=''><strong>" + alcohol.toFixed(1) + " % <small>ALC. by Vol</small></strong></h4>";
        var ibu = val.ibu === "" ? "" : "<strong>" + val.ibu + " <small>IBUs</small></strong>";
        html += "<h4 style='color:#4A148C;line-height:0.5;'> " + ibu + "</h4>";
        html += "<h4 style='color:#4A148C;line-height:0.5;'><strong>" + val.ounces + "<small>oz Btl</small></strong></h4>";
        html += "<h4 style='color:#4A148C;line-height:0.5;'><strong>₹" + price + " <small>price</small></strong></h4>";
        html += "<input data-index='" + val.id + "' type='submit' value='ADD TO CART' class='addCart'>";
        html += "</div></div>";
    });
    $(".message").html(html);
}



//-- Sorting by Alcohol percentage

function sorting() {
    var select = $('#selectAlc').val();
    $.getJSON("http://starlord.hackerearth.com/beercraft", function(data) {

        data = data.sort(function(a, b) {
            if (select == "low") {
                return a.abv - b.abv;
            }
            if (select == "high") {
                return b.abv - a.abv;
            }
        });

        render(data);
    });

}

//-- Filter by Beer Style

function filter() {
    var select2 = $('#select_id2').val();
    var html = "";
    $.getJSON("http://starlord.hackerearth.com/beercraft", function(data) {
        data = data.filter(function(val) {
            return select2 == val.style;
        });
        render(data);
    });
}


//-- Search by text 
function searchText() {
    var searchField = $('#txtSearch').val();
    $.getJSON("http://starlord.hackerearth.com/beercraft", function(data) {

        var html = "";
        data = data.filter(function(val) {
            var lowcase1 = val.name.toLowerCase();
            var lowcase2 = searchField.toLowerCase();
            if (~lowcase1.indexOf(lowcase2)) {
                return val.name;
            }
        });
        render(data);
    });

}

myItems = [];

//-- add to cart
function addItem(newItem) {

    if (myItems.length == 0) {
        newItem.count = 1;
        myItems.push(newItem);

    } else {
        var repeat = false;
        for (var i = 0; i < myItems.length; i++) {
            if (myItems[i].name == newItem.name) {
                myItems[i].count++;
                repeat = true;
            }
        }
        if (!repeat) {
            newItem.count = 1;
            myItems.push(newItem);
        }
    }
    updatePrice();

};

//-- delete from cart
function minusItem(newItem) {
    for (var i = 0; i < myItems.length; i++) {
        if (myItems[i].name == newItem.name && newItem.count !== 0) {
            myItems[i].count--;
        }
    }
    updatePrice();
};

//-- update price
function updatePrice() {
    //-- store in local storage
    localStorage.setItem('sessionData', JSON.stringify(myItems));
    var totalPrice = 0;
    for (var i = 0; i < myItems.length; i++) {
        totalPrice += (myItems[i].count) * (price);
    }
    cartDetails();
    totalPrice = totalPrice;
    $(".totalPrice").html("₹ " + totalPrice);
};

//-- Empty cart
function removeCart() {
    myItems.splice(0, myItems.length);
    cartDetails();
    updatePrice();
};

//-- Cart details
function cartDetails() {
    var text = ""

    myItems.forEach(function(val) {   
        text += "<tr>";
        text += "<td class='col-xs-6 col-sm-6 col-md-6 col-lg-6'>" + val.name + "</td>";
        text += "<td class='col-xs-1 col-sm-1 col-md-1 col-lg-1'><a data-index='" + val.id + "' class='cartButton minusButton'><i class='fa fa-minus-square-o fa-2x'></i></a></td>";
        text += "<td class='col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center'>" + val.count + "</td>";
        text += "<td class='col-xs-1 col-sm-1 col-md-1 col-lg-1'><a data-index='" + val.id + "' class='cartButton plusButton'><i class='fa fa-plus-square-o fa-2x'></i></a></td>";    
        text += "<td class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>₹ " + price + "</td>";
        text += "</tr>";
    });
    $(".cart-list").html(text);
};