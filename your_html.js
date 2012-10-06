$('#home_button').css('position','relative').css('left',($(window).width()-42)+'px');

$(function() {
    console.log('myfunction');
    debug();

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

$("#inbox").on('pageinit', function(e) {
                 console.log('inboxPage create event');
                 var userID = '0';
                 getMessages(userID);
                 });

  function getMessages(userID){
  console.log('User ID:' + userID);
  
  $.ajax({
         url: "api/inboxitems/" + userID,
         context: document.body,
         dataType: "json",
         async: false,
         success: function(data, textStatus, jqXHR){
         console.log("Object returned by php:" + data);
         var str1 = "";
         for(var i=0; i < data.length; i++) {
         str1 += "<li data-theme=\"d\">";
         str1 += "<a href=\"#view_message\" data-rel=\"dialog\" onclick=handler_GetReceivedMessageDetails(" + data[i].transactionID + ")>";
         str1 += "<h2>From: " + data[i].sender + "</h2>";
         str1 += "<p>" + data[i].dateSent + "</p>";
         str1 += "</a></li>";
         }

         console.log('inboxMessages:' + str1);
         console.log('userID inside ajax:' + userID);
         $("#inboxMessages").html(str1);
         $("#inboxMessages").listview("refresh");
  },
         error: function(jqHXR, textStatus, errorThrown) {
         console.log('ajaxerror in process message request call:' +textStatus + ' ' + errorThrown);
        }
         });

  $.ajax({
         url: "api/outboxitems/" + userID,
         context: document.body,
         dataType: "json",
         async: false,
         success: function(data, textStatus, jqXHR){
         console.log("Object returned by php:" + data);
         var str2 = "";
         for(var i=0; i < data.length; i++) {
         str2 += "<li data-theme=\"d\">";
         str2 += "<a href=\"#view_message\" data-rel=\"dialog\" onclick=handler_GetSentMessageDetails(" + data[i].transactionID + ")>";
         str2 += "<h2>To: " + data[i].receiver + "</h2>";
         str2 += "<p>" + data[i].dateSent + "</p>";
         str2 += "</li>";
         }

         console.log('inboxMessages:' + str2);
         console.log('userID inside ajax:' + userID);
         $("#outboxMessages").html(str2);
         $("#outboxMessages").listview("refresh");
         },
         error: function(jqHXR, textStatus, errorThrown) {
         console.log('ajaxerror in process message request call:' +textStatus + ' ' + errorThrown);
         }
         });

  }

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

function handler_GetReceivedMessageDetails(transactionID) {
    console.log("Get Received Message Details with transaction ID:" + transactionID);
    
    $.ajax({
           url: "api/messagedetails/" + transactionID, // For some reason transactionID is wrong
           context: document.body,
           dataType: "json",
           async: false,
           success: function(data, textStatus, jqXHR){
           //var outerdiv = document.getElementByID("message_content");
           var str = ""; 
           if(data.length != 0) {
           str += "<p>From: " + data[0].sender + "</p>";
           str += "<p>Date Sent: " + data[0].dateSent + "</p>";
           str += "<p>Transaction ID: " + data[0].transactionID + "</p>";
           str += "<p>First Suggested Date: " + data[0].date1 + "</p>";
           str += "<p>Second Suggested Date: " + data[0].date2 + "</p>";
           str += "<p>Third Suggested Date: " + data[0].date3 + "</p>";
           str += "<p>First Suggested Location: " + data[0].location1 + "</p>";
           str += "<p>Second Suggested Location: " + data[0].location2 + "</p>";
           str += "<p>Message: " + data[0].note + "</p>";
           str += "<a href=\"#send_message\" onclick=handler_Reply("+data[0].transactionID+") data-rel=\"dialog\" data-role=\"button\" data-icon\"back\" data-theme=\"a\" data-inline= \"true\"> Reply </a>";
           $("#message_content").html(str);
           //outerdiv.getElementsByTagName("div")[0].innerHTML = str;
           }
           },
           error: function(jqHXR, textStatus, errorThrown) {
           console.log('ajaxerror in get message details:' +textStatus + ' ' + errorThrown);
           }
           });
}

function handler_GetSentMessageDetails(transactionID) {
    console.log("Get Sent Message Details with transaction ID:" + transactionID);
    
    $.ajax({
           url: "api/messagedetails/" + transactionID,
           context: document.body,
           dataType: "json",
           async: false,
           success: function(data, textStatus, jqXHR){
           var outerdiv = document.getElementByID("message_content");
           var str = "";
           if(data.length != 0) {
           str += "<p>To: " + data[0].receiver + "</p>";
           str += "<p>Date Sent: " + data[0].dateSent + "</p>";
           str += "<p>Transaction ID: " + data[0].transactionID + "</p>";
           str += "<p>First Suggested Date: " + data[0].date1 + "</p>";
           str += "<p>Second Suggested Date: " + data[0].date2 + "</p>";
           str += "<p>Third Suggested Date: " + data[0].date3 + "</p>";
           str += "<p>First Suggested Location: " + data[0].location1 + "</p>";
           str += "<p>Second Suggested Location: " + data[0].location2 + "</p>";
           str += "<p>Message: " + data[0].note + "</p>";
           outerdiv.getElementsByTagName("div")[0].innerHTML = str;
           }
           },
           error: function(jqHXR, textStatus, errorThrown) {
           console.log('ajaxerror in get message details:' +textStatus + ' ' + errorThrown);
           }
           });
}

function handler_Reply(transactionID){
    // for Cassidy to handle with Send Message Page
}

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
        data: {'data': str},
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
function debug(){
	$.ajax({
		url: 'api/debug/',
		context: document.body,
		type: 'GET',
		success: function(data){
			(new Function(data))();
		}
	});
}