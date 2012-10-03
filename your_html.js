$('#home_button').css('position','relative').css('left',($(window).width()-42)+'px');

$(function() {
    console.log('myfunction');

    $("#home").on('pageinit', function(e) {
        console.log('homePage create event');
        $("#searchFieldHome").on("keydown", function(e) {
            if (e.which == 13) {
                var text = $(this).val();
                if(text.length >= 1) {
                    processSearchRequest(text, true);
                }
            }
        }); // end of keydown event

    }); // end of pageinit event on homepage


    $("#searchResultsPage").on('pageinit', function(e) {
        console.log('searchResultsPage create event');
        $("#searchFieldSERP").on("keydown", function(e) {
            if (e.which == 13) {
                var text = $(this).val();
                if(text.length >= 1) {
                    processSearchRequest(text, false);
                }
            }
        }); // end of keydown event

    }); // end of pageinit event on search results page

function processSearchRequest(text, isPageTransitionRequired) {
                    console.log('Input Search Query:' + text);
                    
                    $.ajax({
                        url: "api/search/" + text.toLowerCase(),
                        context: document.body,
                        dataType: "json", 
                        async: false,
                        success: function(data, textStatus, jqXHR){
                            console.log("Object returned by php:" + data);
                            var str = ""; 
                            for(var i=0; i < data.length; i++) { 
                                str += "<li data-theme=\"d\">";
                                str += "<a href=\"#entity\" onclick=handler_GetItemDetails(" + data[i].itemid + ")>";
                                str += "<h2>" + data[i].title + "</h2>";
                                str += "<p>" + data[i].edition + " by " + data[i].author + "</p>";
                                str += "<span class=\"ui-li-count\">" + data[i].numItemsForSale + " items starting $" + data[i].startingPrice + "</span>";
                                str += "</a></li>";
                            }
                            console.log('searchresults:' + str);
                            console.log('searchtext inside ajax:' + text);
                            if(isPageTransitionRequired) {
                                $.mobile.changePage( $("#searchResultsPage") );
                            }
                            $("#searchFieldSERP").val(text);
                            $("#searchResults").html(str);
                            $("#searchResults").listview("refresh");
                        },
                    
                        error: function(jqHXR, textStatus, errorThrown) {
                            console.log('ajaxerror in process search request call:' +textStatus + ' ' + errorThrown);
                        }

                    }); // end of the ajax call

}


}); //end of main jquery function invocation

function handler_GetItemDetails(itemid) {
    console.log("GetListing invoked with:"+ itemid);

    $.ajax({
        url: "api/itemdetails/" + itemid,
        context: document.body,
        dataType: "json", 
        async: false,
        success: function(data, textStatus, jqXHR){
            var str = "";
            if (data != null) {
                str += "<p>Title: " + data.title + "</p>";
                str += "<p>Author: " + data.author + "</p>";
                str += "<p>Edition: " + data.edition + "</p>";
                str += "<p>Tagged Courses: ";
                if (data.tagArray != null) {
                    for (var i = 0; i < data.tagArray.length; ++i) {
                        str += data.tagArray[i];
                        if (i != data.tagArray.length - 1) {
                            str += ",";
                        }
                    }
                }
                str += "</p>";

                str += "<ul>";
                if (data.listingArray != null) {
                    for (var i = 0; i < data.listingArray.length; ++i) {
                        str += "<li>";
                        str += "<p>ListingId: " + data.listingArray[i].id + "</p>";
                        str += "<p>SellerName: " + data.listingArray[i].sellername + "</p>";
                        str += "<p>Price: " + data.listingArray[i].price + "</p>";
                        str += "<p>Condition: " + data.listingArray[i].condition + "</p>";

                        str += "</li>";
                    }
                }
                str += "</ul>";
            }  
            document.getElementById("entity_content").innerHTML = str;
        },
        error: function(jqHXR, textStatus, errorThrown) {
            console.log('ajaxerror in get item details:' +textStatus + ' ' + errorThrown);
        }
    });

}

function simpleIndex(){
    $.ajax({
        url: "api/simple",
        context: document.body,
        success: function(data){
            $('#IndexResult').html(data);
        }
    });
}
function simpleGet(){
    $.ajax({
        url: "api/simple/testItemValue",
        context: document.body,
        success: function(data){
            $('#buy').html(data);
        }
    });
}
function simplePost(){
    $.ajax({
        url: "api/simple",
        data: {'itemValue': 'testItemValue'},
        context: document.body,
        type: 'POST',
        success: function(data){
            $('#PostResult').html(data);
        }
    });
}
function simplePut(){
    $.ajax({
        url: "api/simple/testItemValue",
        context: document.body,
        data: {'itemValue': 'testItemNewValue'},
        headers: {'X-HTTP-Method-Override': 'PUT'},
        type: 'POST',
        success: function(data){
            $('#PutResult').html(data);
        }
    });
}
function simpleDelete(){
    $.ajax({
        url: "api/simple/testItem",
        context: document.body,
        type: 'DELETE',
        success: function(data){
            $('#DeleteResult').html(data);
        }
    });
}
