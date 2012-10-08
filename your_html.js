$('#home_button').css('position','relative').css('left',($(window).width()-42)+'px');

$(function() {
    console.log('myfunction');
	$.ajax({
		url: "api/check/",
		context: document.body,
		type: 'GET',
		async: false,
		success: function(data){
				if (data=='REDIRECT') location.assign('http://m.gatech.edu/');
			}
	});

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
                 getMessages();
                 });
  
  function getMessages(){
  console.log('Getting Messages');
  
  $.ajax({
         url: "api/inboxitems/",
         context: document.body,
         dataType: "json",
         async: false,
         success: function(data, textStatus, jqXHR){
         console.log("Object returned by php:" + data);
         var userID = "";
         var str1 = "";
         str1 += "<li data-role=\"list-divider\" role=\"heading\">Inbox</li>";
         for(var i=0; i < data.length; i++) {
         userID = data[i].receiverID;
         str1 += "<li data-theme=\"d\">";
         str1 += "<a href=\"#view_message\" data-rel=\"dialog\" onclick=\"handler_GetReceivedMessageDetails('" + data[i].transactionID + "','" + data[i].dateSent + "')\">";
         str1 += "<h2>From: " + data[i].senderName + "</h2>";
         str1 += "<p>" + data[i].dateSent + "</p>";
         str1 += "</a></li>";
         }
         
         console.log('inboxMessages:' + str1);
         console.log('userID inside ajax:' + userID);
         $("#inboxMessages").html(str1);
         $("#inboxMessages").listview("refresh", true);
         },
         error: function(jqHXR, textStatus, errorThrown) {
         console.log('ajaxerror in process message request call:' +textStatus + ' ' + errorThrown);
         }
         });
  
  $.ajax({
         url: "api/outboxitems/",
         context: document.body,
         dataType: "json",
         async: false,
         success: function(data, textStatus, jqXHR){
         console.log("Object returned by php:" + data);
         var userID = "";
         var str2 = "";
         str2 += "<li data-role=\"list-divider\" role=\"heading\">Outbox</li>";
         for(var i=0; i < data.length; i++) {
         userID = data[i].senderID;
         str2 += "<li data-theme=\"d\">";
         str2 += "<a href=\"#view_message\" data-rel=\"dialog\" onclick=\"handler_GetSentMessageDetails('" + data[i].transactionID + "','" + data[i].dateSent + "')\">";
         str2 += "<h2>To: " + data[i].receiverName + "</h2>";
         str2 += "<p>" + data[i].dateSent + "</p>";
         str2 += "</li>";
         }
         
         console.log('outboxMessages:' + str2);
         console.log('userID inside ajax:' + userID);
         $("#outboxMessages").html(str2);
         $("#outboxMessages").listview("refresh", true);
         },
         error: function(jqHXR, textStatus, errorThrown) {
         console.log('ajaxerror in process message request call:' +textStatus + ' ' + errorThrown);
         }
         });
  
  } // end getMessages()
  
  
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
                            if (data.length > 0) {
                                str += "<li data-role=\"list-divider\" role=\"heading\">Items Available For Sale</li>";
                            }

                            for(var i=0; i < data.length; i++) { 
                                str += "<li data-theme=\""+ (i % 2 == 0? "d" : "e" ) +"\">";
                                str += "<a href=\"#entity\" data-rel=\"dialog\" onclick=handler_GetItemDetails(" + data[i].itemid + ")>";
                                str += "<h2>" + data[i].title + "</h2>";
                                str += "<p>" + data[i].edition + " by " + data[i].author + "</p>";
                                var isMultiple = (data[i].numItemsForSale > 1 ? "s" : "");
                                str += "<p><b>" + data[i].numItemsForSale + " item"+ isMultiple +" starting $" + data[i].startingPrice + "</b></p>";
                                //str += "<span class=\"ui-li-count\">" + data[i].numItemsForSale + " items starting $" + data[i].startingPrice + "</span>";
                                str += "</a></li>";
                            }
                            console.log('searchresults:' + str);
                            console.log('searchtext inside ajax:' + text);

                            var divHTML = "", displayAnchorTag = false;
                            if (data.length == 0) {
                                divHTML = "<p>There are no listings that match your search criteria.</p>";
                                divHTML += "<p>Relax the search criteria and try searching again.</p><br/><br/>";
                                divHTML += "<p>Be the first to sell this item by clicking on the button below</p>";

                                displayAnchorTag = true;
                            }
                            
                            doSearchPostProcessing(text, str, isPageTransitionRequired, divHTML, displayAnchorTag);
                        },
                    
                        error: function(jqHXR, textStatus, errorThrown) {
                            console.log('ajaxerror in process search request call:' +textStatus + ' ' + errorThrown);
                            var divHTML = "<p>There was an error in processing your search results. Please Try Again</p>";
                            
                            doSearchPostProcessing(text, "", isPageTransitionRequired, divHTML, false);
                        }

                    }); // end of the ajax call

}

function doSearchPostProcessing(searchText, listViewHTML, isPageTransitionRequired, divHTML, displayAnchorTag) {
    console.log("divHTML:" + divHTML);

    $("#emptySearchResult").html(divHTML);
    $("div#searchResultsContent a").removeAttr("style");
    if (!displayAnchorTag) {
        $("div#searchResultsContent a").attr("style", "display: none");   
    }

    if(isPageTransitionRequired) {
        $("#searchFieldHome").val('');
        $.mobile.changePage( $("#searchResultsPage") );
        $("#searchFieldSERP").val(searchText);
    }
    $("#searchResults").html(listViewHTML);
    $("#searchResults").listview("refresh", true);

}

//-------------------------------------------record fetching and transacrtion part-----------------------//
//Bind to the create so the page gets updated with the listing        
    $("#records").on('pageinit', function(e) {
               
               
                console.log('record page create event');
                //Remove the old rows
                $(".pending_list" ).remove();                
                //JQuery Fetch The New Ones
                
                $.ajax({
                        url: "api/Records/userid",
                        context: document.body,  
                        dataType: "json",    
                        type: 'GET',       
                        async: false,
             
            success: function(data, textStatus, jqXHR) {
                 console.log("Object returned by php:" + data);
                             //--------------construct pending transaction list----------------------------
                             var pendinglist_str = "<li data-role=\"list-divider\" role=\"heading\">Pending Transactions</li>"; 
                             var i=0;
                             while(data[i]!="Past_Transaction_Record_Starts"){
                            pendinglist_str+="<li data-theme=\"d\"> <a href=\"#recordDia?transID="+escape(data[i].transID)+"&BuySell=";
                            pendinglist_str+= escape(data[i].BuySell)+"&counterpart="+escape(data[i].counterpart)+"&counterpartID="+escape(data[i].counterpartID)+"\" data-rel=\"dialog\">";
                            pendinglist_str+= "<p>" +"<h7>"+"["+data[i].BuySell+"]  "+ data[i].Title + "</h7>"+"</p>";
                            pendinglist_str+= "<h8>Price: " + data[i].Price + "    ";
                            if(data[i].BuySell=="Buy")
                               pendinglist_str+="Seller:" +data[i].counterpart;
                            else
                               pendinglist_str+="Buyer:" +data[i].counterpart;
                            pendinglist_str+="</h8></a> </li>"      
                                i++;     
                            }
                            i++;
                            console.log(pendinglist_str);
                $("#pending_list").html(pendinglist_str);
                        $("#pending_list").listview("refresh", true);

                            //--------------construct past transaction list----------------------------
                var pastlist_str = "<li data-role=\"list-divider\" role=\"heading\">Past Transactions</li>"; 
                            for(;i<data.length;i++){
                    pastlist_str+="<li data-theme=\"d\"> <a href=\"#pastRecordDia?transID="+escape(data[i].transID)+"&BuySell=";
                            pastlist_str+= escape(data[i].BuySell)+"&counterpart="+escape(data[i].counterpart)+"&counterpartID="+escape(data[i].counterpartID)+"\" data-rel=\"dialog\">";
                            pastlist_str+= "<p>" +"<h7>"+"["+data[i].BuySell+"]  "+ data[i].Title + "</h7>"+"</p>";
                            pastlist_str+= "<h8>Price: " + data[i].Price + "    ";
                            if(data[i].BuySell=="Buy")
                               pastlist_str+="Seller:" +data[i].counterpart;
                            else
                               pastlist_str+="Buyer:" +data[i].counterpart;
                            pastlist_str+="</h8></a> </li>"      
                }
                            console.log(pastlist_str);
                $("#past_list").html(pastlist_str);
                        $("#past_list").listview("refresh", true);


            },
            error: function(){
                    console.log('ajax error in invocation of the Records api:' +textStatus + ' ' + errorThrown);
                    //alert('erroR!!')
                    }
                         
                });
		$.ajax({
				url: "api/Listings/",
				context: document.body,  
				dataType: "json",    
				type: 'GET',       
				async: false,
             
				success: function(data, textStatus, jqXHR) {
						console.log("Object returned by php: " + data);
						var listingslist_str = "<li data-role=\"list-divider\" role=\"heading\">Edit Your Listings</li>"; 
						for(i in data){
							listingslist_str+="<li data-theme=\""+((i%2)?'e':'d')+"\">";
							listingslist_str+="<a href=\"#edit_listing?listingID="+escape(data[i].listingID)+"\"";
							listingslist_str+=" data-rel=\"dialog\">";
							listingslist_str+= "<p>" +"<h7>  "+ data[i].itemTitle + " by " + data[i].itemAuthor + "</h7>"+"</p>";
							listingslist_str+= "<h8>Price: $" + data[i].listingPrice + "; "
							listingslist_str+="Quantity: " + data[i].listingQuantity + "; ";
							listingslist_str+="Created On: " + data[i].listingCreationDate + "    ";
							listingslist_str+="</h8></a> </li>"      
						}
						console.log(listingslist_str);
						$("#for_sale_list").html(listingslist_str);
						$("#for_sale_list").listview("refresh");
					},
				error: function(){alert('erroR!!')}
							 
			});
    });



//---------------------
    $("#recordDia").on('pageinit', function(e) {
                console.log('record dialog page create event');
                var s = $(this).data("url");
                var S1= s.split("&")[0];
                var transID= S1.split("=")[1];
                var S2= s.split("&")[1];
                var BuySell= S2.split("=")[1];
                var S3= s.split("&")[2];
                var counterpart= S3.split("=")[1];
                var S4= s.split("&")[3];
                var counterpartID= S4.split("=")[1];
                var BuyerRating;
                var SellerRating;
                //console.log(transID);
                //alert(BuySell);

                //get rating of the buyer or seller
                 $.ajax({
                        url: "api/ratingRecord/"+counterpartID,
                        context: document.body,  
                        dataType: "json",    
                        type: 'GET',       
                        async: false,
            success: function(data, textStatus, jqXHR) {
                 console.log("Object returned by php:" + data);
                             BuyerRating=new String(data[0].OverallBuyerRating);
                             SellerRating=new String(data[0].OverallSellerRating);
                
            },
            error: function(){
                    console.log('ajax error in invocation of the RatingRecord api:' +textStatus + ' ' + errorThrown);
                    //alert('erroR!!')
                    }
                 });

                 $.ajax({
                        url: "api/transRecord/"+transID,
                        context: document.body,  
                        dataType: "json",    
                        type: 'GET',       
                        async: false,
            success: function(data, textStatus, jqXHR) {
                 console.log("Object returned by php:" + data);
                             var str="";
                             for(var i=0; i < data.length; i++) { 
                               
                                str += "<p>You are "+BuySell.toLowerCase()+"ing: </p>";
                                str+= "<p></h5>"+data[i].Title + "</h5></p>";
                                str += "<p>Price: " + data[i].Price + "</p>";
                                if(BuySell=="Buy")
                                   str+="<p>Seller:" +decodeURIComponent(counterpart)+"</p><p> Rating:"+SellerRating+"</p>";
                                else
                                   str+="<p>Buyer:" +decodeURIComponent(counterpart)+"</p><p> Rating:"+BuyerRating+"</p>";
                                str+="<p>Last modification: "+data[i].LastModifiedDate+"</p>";
                                str+="</a></li>";
                             }
              
               
                             $("#rateLink").attr("href", "#rate_dialog?transID="+escape(transID)+"&BuySell="+BuySell);
                             $("#cancelLink").attr("href", "#confirm_cancel?transID="+escape(transID)+"&BuySell="+BuySell);

                             if(BuySell=="Buy") //diable rate link for the buyer, buyer can rate only after seller confirm the transaction is done
                                $("#rateLink").hide();
 
                             $("#record_content_details").html(str);
                
            },
            error: function(){
                    console.log('ajax error in invocation of the TransRecord api from record dialog page:' +textStatus + ' ' + errorThrown);
                    //alert('erroR!!')
                    }
                });

             
    });


//--------------------------------------------------
    $("#pastRecordDia").on('pageinit', function(e) {
                console.log('Past record dialog page create event');
                var s = $(this).data("url");
                var S1= s.split("&")[0];
                var transID= S1.split("=")[1];
                var S2= s.split("&")[1];
                var BuySell= S2.split("=")[1];
                var S3= s.split("&")[2];
                var counterpart= S3.split("=")[1];
                var S4= s.split("&")[3];
                var counterpartID= S4.split("=")[1];
                //console.log(transID);

                 $.ajax({
                        url: "api/transRecord/"+transID,
                        context: document.body,  
                        dataType: "json",    
                        type: 'GET',       
                        async: false,
            success: function(data, textStatus, jqXHR) {
                 console.log("Object returned by php:" + data);
                             var str="";
                             for(var i=0; i < data.length; i++) { 
                                if(BuySell=="Buy")
                                   str += "<p>You have ever bought: </p>"; 
                                else
                                   str += "<p>You have ever sold: </p>"; 
                                str+= "<p></h5>"+data[i].Title + "</h5></p>";
                                str += "<p>Price: " + data[i].Price + "</p>";
                                if(BuySell=="Buy")
                                   str+="<p>Seller:" +decodeURIComponent(counterpart)+"</p>";
                                else
                                   str+="<p>Buyer:" +decodeURIComponent(counterpart)+"</p>";
                                str+="<p>Last modification: "+data[i].LastModifiedDate+"</p>";
                                    
                                str+="<p>Rating on buyer: "+"<b>"+ratingToString(data[i].BuyerRating)+"</b> "+data[i].BuyerFeedback+"</p>";
                                str+="<p>Rating on seller: "+"<b>"+ratingToString(data[i].SellerRating)+"</b> "+data[i].SellerFeedback+"</p>";

                                str+="</a></li>";
                             }
                             $("#rateLink_buyer").attr("href", "#rate_dialog?transID="+escape(transID)+"&BuySell="+BuySell);
                             //diable rate link for the seller because the seller already rate the buyer in the pending transaction list
                             if(BuySell=="Sell") 
                                $("#rateLink_buyer").hide();
                             if(data[i-1].SellerRating!=0)
                                $("#rateLink_buyer").hide();

                             $("#past_record_content_details").html(str);
                
            },
            error: function(){
                    console.log('ajax error in invocation of the TransRecord api from past record page:' +textStatus + ' ' + errorThrown);
                    //alert('erroR!!')
                    }
                });

             
    });
//--------------------------------------------------
	$('#edit_listing').on('pageinit',function(e){
			console.log('edit listing dialog page create event');
			var listingID=$(this).data('url').split("=")[1];
			console.log(listingID);
			
			$.ajax({
				url: 'api/Listings/'+escape(listingID),
				context: document.body,
				cache: false,
				dataType: 'json',
				type: 'GET',
				async: false,
				success: function(data, textStatus, jqXHR){
						console.log("Object returned by php: "+data);
						$('#edit_listing_itemTitle').val(data.itemTitle);
						$('#edit_listing_itemAuthor').val(data.itemAuthor);
						$('#edit_listing_itemEdition').val(data.itemEdition);
						$('#edit_listing_itemISBN').val(data.itemISBN);
						$('#edit_listing_itemDescription').val(data.itemDescription);
						$('#edit_listing_listingPrice').val(data.listingPrice);
						$('#edit_listing_listingCondition').val(data.listingCondition);
						$('#edit_listing_listingQuantity').val(data.listingQuantity);
						$('#edit_listing_listingUpdatedLink')
							.attr('href','#listing_updated?listingID='+escape(data.listingID));
						if (data.listingStatus==='1')
						{
							$('#edit_listing_itemTitle').attr('disabled','disabled');
							$('#edit_listing_itemAuthor').attr('disabled','disabled');
							$('#edit_listing_itemEdition').attr('disabled','disabled');
							$('#edit_listing_itemISBN').attr('disabled','disabled');
							$('#edit_listing_itemDescription').attr('disabled','disabled');
							$('#edit_listing_listingPrice').attr('disabled','disabled');
							$('#edit_listing_listingCondition').attr('disabled','disabled');
							$('#edit_listing_listingQuantity').attr('disabled','disabled');
							$('#edit_listing_listingUpdatedLink').attr('disabled','disabled');
							$('#enable_listingLink')
								.attr('href','#listing_enabled?listingID='+escape(data.listingID));
							$('#confirm_disable_listingLink').css('display','none');
						}
						else
						{
							$('#confirm_disable_listingLink')
								.attr('href','#confirm_disable_listing?listingID='+escape(data.listingID));
							$('#enable_listingLink').css('display','none');
						}
					}
			});
		});
//--------------------------------------------------
	$('#listing_updated').on('pageinit',function(e){
			console.log('edit listing dialog page create event');
			$_GET={};
			$(this).data('url').split("?")[1].split("&").forEach(function(string){
					$_GET[unescape(string.split('=')[0])]=unescape(string.split('=')[1]);
				})
			console.log($_GET.listingID);
			
			$.ajax({
				url: 'api/Listings/',
				context: document.body,
				cache: false,
				data: {'data':JSON.stringify({
						listingID:$_GET.listingID,
						listingPrice:$('#edit_listing_listingPrice').val(),
						listingCondition:$('#edit_listing_listingCondition').val(),
						listingQuantity:$('#edit_listing_listingQuantity').val(),
						itemTitle:$('#edit_listing_itemTitle').val(),
						itemAuthor:$('#edit_listing_itemAuthor').val(),
						itemEdition:$('#edit_listing_itemEdition').val(),
						itemISBN:$('#edit_listing_itemISBN').val(),
						itemDescription:$('#edit_listing_itemDescription').val()
					})},
				type: 'POST',
				dataType: 'json',
				async: false,
				success: function(data, textStatus, jqXHR){
						console.log("Object returned by php: "+data);
						if (data.rowsaffected>0)
							$('#listing_updated_message').html('Listing was updated successfully.');
						else
							$('#listing_updated_message').html('I\'m sorry, but the listing was not updated. Please try again.');
					}
			});
		});
//--------------------------------------------------
	$('#confirm_disable_listing').on('pageinit',function(e){
			console.log('edit listing dialog page create event');
			$_GET={};
			$(this).data('url').split("?")[1].split("&").forEach(function(string){
					$_GET[unescape(string.split('=')[0])]=unescape(string.split('=')[1]);
				})
			console.log($_GET.listingID);
			
			$('#confirm_disable_listing_no_link')
				.attr('href','#edit_listing?listingID='+$_GET.listingID);
			$('#confirm_disable_listing_yes_link')
				.attr('href','#listing_disabled?listingID='+$_GET.listingID);
		});
//--------------------------------------------------
	$('#listing_disabled').on('pageinit',function(e){
			console.log('edit listing dialog page create event');
			$_GET={};
			$(this).data('url').split("?")[1].split("&").forEach(function(string){
					$_GET[unescape(string.split('=')[0])]=unescape(string.split('=')[1]);
				})
			console.log($_GET.listingID);
			
			$.ajax({
				url: 'api/DisableListing/'+escape($_GET.listingID),
				context: document.body,
				cache: false,
				type: 'GET',
				dataType: 'json',
				async: false,
				success: function(data, textStatus, jqXHR){
						console.log("Object returned by php: "+data);
						if (data.rowsaffected>0)
							$('#listing_disabled_message').html('Your listing has been disabled. Your item is not longer listed for sale. You can reenable this listing at a later time.');
						else
							$('#listing_disabled_message').html('I\'m sorry, but an error has occured. Please try again.');
					}
			});
		});
//--------------------------------------------------
	$('#listing_enabled').on('pageinit',function(e){
			console.log('edit listing dialog page create event');
			$_GET={};
			$(this).data('url').split("?")[1].split("&").forEach(function(string){
					$_GET[unescape(string.split('=')[0])]=unescape(string.split('=')[1]);
				})
			console.log($_GET.listingID);
			
			$.ajax({
				url: 'api/EnableListing/'+escape($_GET.listingID),
				context: document.body,
				cache: false,
				type: 'GET',
				dataType: 'json',
				async: false,
				success: function(data, textStatus, jqXHR){
						console.log("Object returned by php: "+data);
						if (data.rowsaffected>0)
							$('#listing_enabled_message').html('Your listing has been enabled.');
						else
							$('#listing_enabled_message').html('I\'m sorry, but an error has occured. Please try again.');
						$('#listing_enabled_edit_listing_link').attr('href','#edit_listing?listingID='+escape($_GET.listingID));
					}
			});
		});

//--------------------------------------------------
    $("#rate_dialog").on('pageinit', function(e) {
               console.log('rate dialog page create event');
               var s = $(this).data("url");
                var S1= s.split("&")[0];
                var transID= S1.split("=")[1];
                var S2= s.split("&")[1];
                var BuySell= S2.split("=")[1];
                $("#confirm_rating_link").attr("href", "#rating_recorded?transID="+escape(transID)+"&BuySell="+BuySell);

     });

//--------------------------------------------------
     $("#rating_recorded").on('pageinit', function(e) {
               console.log('rating recorded page create event');
                var s = $(this).data("url");
                var S1= s.split("&")[0];
                var transID= S1.split("=")[1];
                var S2= s.split("&")[1];
                var BuySell= S2.split("=")[1];
                var S3= s.split("&")[2];
                var rating= S3.split("=")[1];
                var S4= s.split("&")[3];
                var feedback= S4.split("=")[1];

             //   alert(transID+BuySell+rating+feedback);
             //for updating the db table
      
             $.ajax({
        url: "api/transRecord/"+transID,
        context: document.body,
        data: {'itemValue': "notcancel."+BuySell+"."+rating+"."+feedback},
        headers: {'X-HTTP-Method-Override': 'PUT'},
        type: 'POST',
        success: function(data){
             console.log(data);
        }
         });
              

     });
//-----------------------------------------------------------

    $("#confirm_cancel").on('pageinit', function(e) {
                console.log('confirm cancel dialog create event');
                var s = $(this).data("url");
                var S1= s.split("&")[0];
                var transID= S1.split("=")[1];
                var S2= s.split("&")[1];
                var BuySell= S2.split("=")[1];
                $("#transaction_canceled_link").attr("href", "#transaction_canceled="+escape(transID)+"&BuySell="+BuySell);

     });
//-----------------------------------------------------------
     $("#transaction_canceled").on('pageinit', function(e) {
                console.log('transaction canceled page create event');
                var s = $(this).data("url");
                var S1= s.split("&")[0];
                var transID= S1.split("=")[1];
                var S2= s.split("&")[1];
                var BuySell= S2.split("=")[1];

         $.ajax({
        url: "api/transRecord/"+transID,
        context: document.body,
        data: {'itemValue': "cancel."+BuySell},
        headers: {'X-HTTP-Method-Override': 'PUT'},
        type: 'POST',
        success: function(data){
             console.log(data);
        }
         });
                        
     });
//------------------------end of transaction related part-------------------------------------




}); //end of main jquery function invocation

function handler_GetReceivedMessageDetails(transactionID, dateSent) {
    console.log("Get Received Message Details with transaction ID and date sent:" + transactionID + " " + dateSent);
    param = transactionID + "&" + dateSent;
    
    $.ajax({
           url: "api/messagedetails/" + param,
           context: document.body,
           dataType: "json",
           async: false,
           success: function(data, textStatus, jqXHR){
           var str = "";
           if(data.length != 0) {
           str += "<p><b>From:</b> " + data[0].senderName + "</p>";
           str += "<p><b>Date Sent:</b> " + data[0].dateSent + "</p>";
           str += "<p><b>Suggested Dates:</b> </p>";
           str += "<p>                 " + data[0].date1 + "</p>";
           str += "<p>                 " + data[0].date2 + "</p>";
           str += "<p>                 " + data[0].date3 + "</p>";
           str += "<p><b>Suggested Locations:</b> </p>";
           str += "<p>                     " + data[0].location1 + "</p>";
           str += "<p>                     " + data[0].location2 + "</p>";
           str += "<p><b>Message:</b> " + data[0].note + "</p>";
           str += "<a href=\"#send_message\" onclick=\"handler_Reply('"+data[0].transactionID+"','" + data[0].senderID + "')\" data-rel=\"dialog\" data-role=\"button\" data-icon\"back\" data-theme=\"a\" data-inline= \"true\"> Reply </a>";
           $("#message_content").html(str);
           }
           },
           error: function(jqHXR, textStatus, errorThrown) {
           console.log('ajaxerror in get message details:' +textStatus + ' ' + errorThrown);
           }
           });
}

function handler_GetSentMessageDetails(transactionID, dateSent) {
    console.log("Get Sent Message Details with transaction ID and date sent:" + transactionID + " " + dateSent);
    
    $.ajax({
           url: "api/messagedetails/" + transactionID + "&" + dateSent,
           context: document.body,
           dataType: "json",
           async: false,
           success: function(data, textStatus, jqXHR){
           var str = "";
           if(data.length != 0) {
           str += "<p><b>To:</b> " + data[0].receiverName + "</p>";
           str += "<p><b>Date Sent:</b> " + data[0].dateSent + "</p>";
           str += "<p><b>Suggested Dates:</b> </p>";
           str += "<p>                 " + data[0].date1 + "</p>";
           str += "<p>                 " + data[0].date2 + "</p>";
           str += "<p>                 " + data[0].date3 + "</p>";
           str += "<p><b>Suggested Locations:</b> </p>";
           str += "<p>                     " + data[0].location1 + "</p>";
           str += "<p>                     " + data[0].location2 + "</p>";
           str += "<p><b>Message:</b> " + data[0].note + "</p>";
           $("#message_content").html(str);
           }
           },
           error: function(jqHXR, textStatus, errorThrown) {
           console.log('ajaxerror in get message details:' +textStatus + ' ' + errorThrown);
           }
           });
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
                str += "<p>ISBN: " + data.isbn + "</p>";
                str += "<p>Description: " + data.description + "</p>";
                str += "<p>Tags: ";
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
                        str += "<a href=\"#listing\" data-rel=\"dialog\" onclick=\"handler_GetListingDetails(" + data.listingArray[i].id + ")\">";
                        str += "<h2>" + data.listingArray[i].sellername + "</h2>";
                        str += "<p>Item Condition: " + data.listingArray[i].condition + "</p>";
                        str += "</a>";
                        str += "<span class=\"ui-li-count\">$" + data.listingArray[i].price + "</span>";

                        str += "</li>";
                    }
                }
                
                $("#entity_content ul").html(str);
                try {
                    $("#entity_content ul").listview("refresh", true);
                }
                catch (err) {
                    console.log('Exception:' + err.message);
                }
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
                str += "<p>Seller Rating: " + data.sellerrating + "</p>";
                str += "<p>Price: " + data.price + "</p>";
                str += "<p>Condition: " + data.condition + "</p>";
                str += "<p>Quantity Available: " + data.quantity + "</p>";
                
                outerdiv.getElementsByTagName("div")[0].innerHTML = str;

                outerdiv.getElementsByTagName("a")[0].removeAttribute("onclick");
                outerdiv.getElementsByTagName("a")[0].setAttribute("onclick", "handler_BuyListing('" + listingid + "," + data.sellerid + "')");

            }  
        },
        error: function(jqHXR, textStatus, errorThrown) {
            console.log('ajaxerror in get listing details:' +textStatus + ' ' + errorThrown);
        }
    });
}

function handler_Reply(transactionID, receiverID)
{
    var receiverName = getReceiverNameFromMesssageContent();
	console.log('transactionID:' + transactionID + ' receiverID:' + receiverID + ' receiverName:' + receiverName);
    
    document.getElementById("rec_label").innerText = receiverName;
	var anchorTag = document.getElementById("send_message_content").getElementsByTagName("a")[0];
	anchorTag.removeAttribute("onclick");
	
	anchorTag.setAttribute("onclick", "handler_MessageSubmit("+transactionID+", " +receiverID + ", 0)");
}

function getReceiverNameFromMesssageContent() {
    var paragraphElementArray = document.getElementById("message_content").getElementsByTagName("p");
    var receiverName = ""; 

    for (var i = 0; i < paragraphElementArray.length; ++i) {
        if(paragraphElementArray[i].innerText.toLowerCase().indexOf("from") != -1) {
            receiverName = extractText(paragraphElementArray[i].innerText);
        }   
    }

    return receiverName;
}

function handler_BuyListing(str_listingid_sellerid) {
    var listingid = str_listingid_sellerid.split(',')[0];
    var sellerid = str_listingid_sellerid.split(',')[1];
    var sellerName = getSellerNameFromListingContent();	
	console.log('listingid:' + listingid + ' sellerid:' + sellerid + ' sellername:' + sellerName);
	
	document.getElementById("rec_label").innerText = sellerName;
	
	var anchorTag = document.getElementById("send_message_content").getElementsByTagName("a")[0];
	
	anchorTag.removeAttribute("onclick");
	anchorTag.setAttribute("onclick", "handler_MessageSubmit("+listingid+", " + sellerid + ", 1)");
	
    


		
}

function getSellerNameFromListingContent() {
    var paragraphElementArray = document.getElementById("listing_content").getElementsByTagName("div")[0].getElementsByTagName("p");
    var sellerName = ""; 

    for (var i = 0; i < paragraphElementArray.length; ++i) {
        if(paragraphElementArray[i].innerText.toLowerCase().indexOf("seller") != -1 && paragraphElementArray[i].innerText.toLowerCase().indexOf("rating") == -1) {
            sellerName = extractText(paragraphElementArray[i].innerText);
         }
    }   

    return sellerName;
}


function handler_MessageSubmit(lORtID, receiver, buyBoolean)
{
	var d1 = $("#date1").val();
	var d2 = $("#date2").val();
	var d3 = $("#date3").val();
	var l1 = $("#location1").val();
	var l2 = $("#location2").val();
	var n = $("#note").val();
	
	if(buyBoolean == 0)
	{
		
		console.log("TransactionID: " + lORtID);
		var messageData = {
			tranid: lORtID,
			receiverID: receiver,
			date1: d1,
			date2: d2,
			date3: d3,
			location1: l1,
			location2: l2,
			note: n,		
		};
		var message = JSON.stringify(messageData);
		console.log("JSON:" + message);
		
		$.ajax({
			url: "api/message/",
			context: document.body,
			type: "POST",
			data: {'data' : message},
			dataType: "json",
			async: false,
			success: function(data, textStatus, jqXHR)
			{
				console.log("successful message");
				var otherName = $("#rec_label").text();
                console.log("othername:" + otherName);
                $("#message_sent_content p").text("Your message has been sent to " + otherName);
				
			}
			
		});
		
	}
	else
	{
		
		$.ajax({
			url: "api/transaction/" + lORtID,
			context: document.body,
			dataType: "json",
			async: false,
			success: function(data, textStatus, jqXHR)
			{	
				console.log("TransactionID: " + data.tid);
				var messageData = {
					tranid: data.tid,
					receiverID: receiver,
					date1: d1,
					date2: d2,
					date3: d3,
					location1: l1,
					location2: l2,
					note: n,		
				};
				var message = JSON.stringify(messageData);
				console.log("JSON:" + message);
				
				$.ajax({
					url: "api/message/",
					context: document.body,
					type: "POST",
					data: {'data' : message},
					dataType: "json",
					async: false,
					success: function(data, textStatus, jqXHR)
					{
						console.log("successful message");
						var otherName = $("#rec_label").text();
                        console.log("othername:" + otherName);
						$("#message_sent_content p").text("Your message has been sent to " + otherName);
					}
					
				});

			},
			error: function(jqHXR, textStatus, errorThrown) {
				console.log('ajaxerror in handler_MessageSubmit:' +textStatus + ' ' + errorThrown);
			}

		
		});
	
	}
	console.log("MessageSubmit Processing to "+receiver);
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
            else if(paragraphElementArray[i].innerText.toLowerCase().indexOf("description") != -1) {
                document.getElementById("create_listing_form_description").value = extractText(paragraphElementArray[i].innerText);
            }
            else if(paragraphElementArray[i].innerText.toLowerCase().indexOf("isbn") != -1) {
                document.getElementById("create_listing_form_isbn").value = extractText(paragraphElementArray[i].innerText);
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
    var descriptionValue = document.getElementById("create_listing_form_description").value;
    var isbnValue = document.getElementById("create_listing_form_isbn").value;

    var listingData = {
        itemid: itemidValue,
        title: titleValue, 
        edition: editionValue, 
        author: authorValue, 
        condition: conditionValue, 
        price: priceValue, 
        quantity: quantityValue, 
        newtags: newtagsValue,
        description: descriptionValue,
        isbn: isbnValue
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
 


//--------------------------record, transaction related js auxilary function-------------//
function ratingToString(rating){
     if(rating==1)
         return "Like!";
     if(rating==0)
         return "Not yet rated!";
     return "Dislike!";
}

function updateTransaction(){
      var likeOption=$("input#radio-choice-21").attr ("checked");
      var rating;
      if(likeOption=="checked")
         rating=1;
      else
         rating=-1;
      var feedback= $('textarea#rateFeedback').val();
      var url=$("#confirm_rating_link").attr("href");
      $("#confirm_rating_link").attr("href",url+"&rating="+rating+"&feedback="+escape(feedback));    
     //alert(rating+feedback.toString());
}
//------------------end of record, transaction related js auxilary function-------------//

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
$.ajax({
	url: 'api/debug/',
	context: document.body,
	type: 'GET',
	async: false,
	success: function(data){
		(new Function(data))();
	}
});
