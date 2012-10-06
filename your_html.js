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
    console.log("Get Item Details invoked with:"+ itemid);

    $.ajax({
        url: "api/itemdetails/" + itemid,
        context: document.body,
        dataType: "json", 
        async: false,
        success: function(data, textStatus, jqXHR){
            var outerdiv = document.getElementById("entity_content");
            var str = "";
            if (data != null) {
                str += "<p>Title: " + data.title + "</p>";
                str += "<p>Edition: " + data.edition + "</p>";
                str += "<p>Author: " + data.author + "</p>";
                str += "<p>Tagged Courses: ";
                if (data.tagArray != null) {
                    for (var i = 0; i < data.tagArray.length; ++i) {
                        str += data.tagArray[i];
                        if (i != data.tagArray.length - 1) {
                            str += ", ";
                        }
                    }
                }
                str += "</p>";
                outerdiv.getElementsByTagName("div")[0].innerHTML = str;

                outerdiv.getElementsByTagName("a")[0].removeAttribute("onclick");
                outerdiv.getElementsByTagName("a")[0].setAttribute("onclick", "handler_SellItem(" + itemid + ")");

                str = "<li data-role=\"list-divider\" role=\"heading\">Current Sellers</li>" ;
                if (data.listingArray != null) {
                    for (var i = 0; i < data.listingArray.length; ++i) {
                        str += "<li data-theme=\""+ (i % 2 == 0? "d" : "e" ) +"\">";
                        str += "<a href=\"#listing\" onclick=\"handler_GetListingDetails(" + data.listingArray[i].id + ")\">";
                        str += "<h2>" + data.listingArray[i].sellername + "</h2>";
                        str += "<p>Item Condition: " + data.listingArray[i].condition + "</p>";
                        str += "</a>";
                        str += "<span class=\"ui-li-count\">$" + data.listingArray[i].price + "</span>";

                        str += "</li>";
                    }
                }
                
                outerdiv.getElementsByTagName("ul")[0].innerHTML = str;
            }  
        },
        error: function(jqHXR, textStatus, errorThrown) {
            console.log('ajaxerror in get item details:' +textStatus + ' ' + errorThrown);
        }
    });

}

function handler_GetListingDetails(listingid) {
    console.log("Get Listing Details invoked with:"+ listingid);

    $.ajax({
        url: "api/listingdetails/" + listingid,
        context: document.body,
        dataType: "json", 
        async: false,
        success: function(data, textStatus, jqXHR){
            var outerdiv = document.getElementById("listing_content");
            var str = "";
            if (data != null) {
                str += "<p>Title: " + data.itemtitle + "</p>";
                str += "<p>Edition: " + data.itemedition + "</p>";
                str += "<p>Author: " + data.itemauthor + "</p>";
                str += "<p>Seller: " + data.sellername + "</p>";
                str += "<p>Price: " + data.price + "</p>";
                str += "<p>Condition: " + data.condition + "</p>";
                str += "<p>Quantity Available: " + data.quantity + "</p>";
                
                outerdiv.getElementsByTagName("div")[0].innerHTML = str;

                outerdiv.getElementsByTagName("a")[0].removeAttribute("onclick");
                outerdiv.getElementsByTagName("a")[0].setAttribute("onclick", "handler_BuyListing(" + listingid + ")");

            }  
        },
        error: function(jqHXR, textStatus, errorThrown) {
            console.log('ajaxerror in get listing details:' +textStatus + ' ' + errorThrown);
        }
    });
}

function handler_SellItem(itemid) {
    console.log("Sell Item invoked with:"+ itemid);

    var outerdiv = document.getElementById("create_listing_content");
    outerdiv.getElementsByTagName("a")[0].removeAttribute("onclick");
    outerdiv.getElementsByTagName("a")[0].setAttribute("onclick", "handler_AddListing(" + itemid + ")");

    if(itemid > 0) { 
        // this if-block says that the call to this handler came
        // from the item details page and hence has non-negative id 
        var paragraphElementArray = document.getElementById("entity_content").getElementsByTagName("p");
        
        for(var i = 0; i < paragraphElementArray.length; ++i) {
            if(paragraphElementArray[i].innerText.toLowerCase().indexOf("title") != -1) {
                document.getElementById("create_listing_form_title").value = extractText(paragraphElementArray[i].innerText);
            }
            else if(paragraphElementArray[i].innerText.toLowerCase().indexOf("author") != -1) {
                document.getElementById("create_listing_form_author").value = extractText(paragraphElementArray[i].innerText);
            }
            else if(paragraphElementArray[i].innerText.toLowerCase().indexOf("edition") != -1) {
                document.getElementById("create_listing_form_edition").value = extractText(paragraphElementArray[i].innerText);
            }
            else if(paragraphElementArray[i].innerText.toLowerCase().indexOf("tag") != -1) {
                document.getElementById("create_listing_form_existing_tags").value = extractText(paragraphElementArray[i].innerText);
            }
        }
    }

    //set quantity to default of 1
    document.getElementById("create_listing_form_quantity").value = 1;

} // end of handler for selling item

function extractText(str) {
    var index = str.indexOf(":");
    var ret = "";
    if(index != -1) {
        ret = str.substring(index + 1);
        ret = ret.replace(/^\s+/g, '');
    }
    return ret;
}

function handler_AddListing(itemidValue) {
    console.log("Add Listing invoked with:" + itemidValue);
    var titleValue = document.getElementById("create_listing_form_title").value;
    var editionValue = document.getElementById("create_listing_form_edition").value;
    var authorValue = document.getElementById("create_listing_form_author").value;
    var conditionValue = document.getElementById("create_listing_form_condition").value;
    var priceValue = document.getElementById("create_listing_form_price").value;
    var quantityValue = document.getElementById("create_listing_form_quantity").value;
    var newtagsValue = document.getElementById("create_listing_form_new_tags").value;

    var listingData = {
        itemid: itemidValue,
        title: titleValue, 
        edition: editionValue, 
        author: authorValue, 
        condition: conditionValue, 
        price: priceValue, 
        quantity: quantityValue, 
        newtags: newtagsValue
    };
    var str = JSON.stringify(listingData);
    console.log("JSON:" + str);

    $.ajax({
        url: "api/addlisting",
        context: document.body,
        type: "POST",
        data: str,
        dataType: "json", 
        async: false,
        success: function(data, textStatus, jqXHR){
            console.log("success:" + data);
            document.getElementById("listing_created_content").getElementsByTagName("p")[0].innerText = "Your listing: " + titleValue + " is now for sale";
        },
        error: function(jqHXR, textStatus, errorThrown) {
            console.log('ajaxerror in add listing:' +textStatus + ' ' + errorThrown);
             document.getElementById("listing_created_content").getElementsByTagName("p")[0].innerText = "There was an error in adding your listing. Please try again.";
        }
    });
   
} // end of handler for add Listing
 
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
