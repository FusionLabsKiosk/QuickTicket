//Global Vars
var SlidePosition = {
    LEFT : "left", 
    RIGHT : "right"
};

var TICKET_SLIDE = 200;
var PURCHASE_SLIDE = 200;

var CurrentSession;

$(document).ready(Init);

function Init() {
    CurrentSession = new Session();
    AddListeners();
    FormatPages();
    UpdateClock();
    sandbox.initialize();
    data.initializeData();
    ReturnMainMenu_ClickHandler();
}
function FormatPages() {
    var slideContainerHeight = $('body').outerHeight() - $('body>header').outerHeight();
    $('#slide-container').height(slideContainerHeight);
    $('.cinema-name').html(data.CINEMA_NAME);
}
function UpdateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var amPm = h >= 12 ? ' pm' : ' am';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    $('.clock-hours').html(h);
    $('.clock-minutes').html(m);
    $('.clock-ampm').html(amPm);
    
    setTimeout(UpdateClock, 30000);
}


function AddTicket(clearExisting) {
    var tickets = $('#page-showing .showing-tickets .ticket');
    if (clearExisting) {
        $('#page-showing .showing-tickets').empty();
        tickets = [];
    }
    var ticketID = Math.floor((Math.random() * 1000) + 1000);
    $.each($(tickets), function() {
        var id = parseInt($(this).attr('data-id'));
        if (id === ticketID) {
            ticketID = Math.floor((Math.Random * 1000) + 1000);
        }
    });
    
    var ticketsDisplayed = tickets.length;
    var ticket = $('<div/>').addClass('ticket').css('display', 'none').attr('data-id', ticketID);
    ticket.append($('<span/>').addClass('showing-time').html(CurrentSession.showing.time));
    ticket.append($('<span/>').addClass('showing-type').html(CurrentSession.showing.theater.pricing.name));
    ticket.append($('<select/>').addClass('ticket-type'));
    ticket.append($('<span/>').addClass('ticket-price'));
    ticket.append($('<span/>').addClass('ticket-multiplier').html('x'));
    ticket.append($('<span/>').addClass('ticket-quantity').html('1'));
    ticket.append($('<button/>').addClass('ticket-quantity-decrease').html('-').click(Showing_TicketQuantityDecrease_ClickHandler));
    ticket.append($('<button/>').addClass('ticket-quantity-increase').html('+').click(Showing_TicketQuantityIncrease_ClickHandler));
    ticket.append($('<span/>').addClass('ticket-total'));
    ticket.append($('<button/>').addClass('delete-ticket').css('visibility', 'hidden').html('X'));
    
    $('#page-showing .showing-tickets').append(ticket);
    
    if(ticketsDisplayed > 0) {
        var deleteButton = $('#page-showing .ticket[data-id="' + ticketID + '"] .delete-ticket');
        deleteButton.css('visibility', 'visible');
        deleteButton.click(Showing_DeleteTickets_ClickHandler);
    }
    $('#page-showing .ticket-type').each(function() {
        var showingTicketType = $(this);
        if (showingTicketType.children().length === 0) {
            var tickets = CurrentSession.showing.theater.pricing.tickets;
            for (var i = 0; i < tickets.length; i++) {
                var ticketTypeString = '<option value="' + tickets[i].ticketType.name + '">' + tickets[i].ticketType.name + '</option>';
                showingTicketType.append(ticketTypeString);
            }
        }
    });
    
    $('#page-showing .ticket[data-id="' + ticketID + '"] .ticket-type').change(Showing_TicketType_ChangeHandler);
    
    UpdateTickets();
    
    $('#page-showing .ticket[data-id="' + ticketID + '"]').show(TICKET_SLIDE);
}
function RemoveTicket(ticketID) {
    $('#page-showing .showing-tickets .ticket[data-id="' + ticketID + '"]').hide(TICKET_SLIDE, function(){
        $(this).remove();
        UpdateTickets();
    });
}
function ModifyTicketQuantity(ticketID, increase) {
    var ticketQuantity = $('#page-showing .showing-tickets .ticket[data-id="' + ticketID + '"] .ticket-quantity');
    var newQuantity = 0;
    if (increase) {
        newQuantity = parseInt(ticketQuantity.html()) + 1;
    }
    else {
        newQuantity = parseInt(ticketQuantity.html()) - 1;
        if (newQuantity < 0) {
            newQuantity = 0;
        }
    }
    ticketQuantity.html(newQuantity);
    UpdateTickets();
}
function UpdateTickets() {
    var totalPrice = 0;
    $.each($('#page-showing .ticket'), function() {
       var ticket = $(this);
       var ticketType = $('.ticket-type option:selected', ticket).val();
       var tickets = CurrentSession.showing.theater.pricing.tickets;
       var price = 0.00;
       for (var i = 0; i < tickets.length; i++) {
           if (tickets[i].ticketType.name === ticketType) {
               price = tickets[i].price;
               break;
           }
       }

       var priceElement = $('.ticket-price', ticket);
       priceElement.html(FormatCurrency(price));

       var ticketQuantity = parseInt($('.ticket-quantity', ticket).html());

       var ticketTotal = price * ticketQuantity;
       $('.ticket-total', ticket).html(FormatCurrency(ticketTotal));

       totalPrice += ticketTotal;
    });
    $('#page-showing .tickets-grand-total').html(FormatCurrency(totalPrice, true));
}
function CreateTicketSummary() {
    var summary = $('<div/>').addClass('tickets');
    var ticketTotal = 0;
    var ticketQuantities = CurrentSession.receipt.getTicketsWithQuantity();
    for (var i = 0; i < ticketQuantities.length; i++) {
        CreateTicketDiv(ticketQuantities[i]).appendTo(summary);
        ticketTotal += (ticketQuantities[i].price * ticketQuantities[i].quantity);
    }
    CreateTicketTotalDiv('----------').addClass('tickets-total-line').appendTo(summary);
    CreateTicketTotalDiv(FormatCurrency(ticketTotal)).addClass('tickets-total').appendTo(summary);
    return summary;
}
function CreateTicketDiv(ticket) {
    var quantity = typeof ticket.quantity === 'undefined' ? 1 : ticket.quantity;
    return $('<div/>').addClass('ticket')
                .append($('<span/>').addClass('ticket-movie-title').html(CurrentSession.showing.movie.title))
                .append($('<span/>').addClass('ticket-time').html(CurrentSession.showing.time))
                .append($('<span/>').addClass('ticket-type').html(ticket.ticketType.name))
                .append($('<span/>').addClass('ticket-price').html(FormatCurrency(ticket.price)))
                .append($('<span/>').addClass('ticket-multiplier').html('x'))
                .append($('<span/>').addClass('ticket-quantity').html(quantity));
}
function CreateTicketTotalDiv(priceHtml) {
    var totalTitle = '';
    if(priceHtml.indexOf('$') > -1)
    {
        totalTitle = '<strong>Total</strong>'
    }
    return $('<div/>').addClass('ticket')
                .append($('<span/>').addClass('ticket-movie-title').css('visibility', 'hidden').html(CurrentSession.showing.movie.title))
                .append($('<span/>').addClass('ticket-time').html(''))
                .append($('<span/>').addClass('ticket-type').html(totalTitle))
                .append($('<span/>').addClass('ticket-price').html(priceHtml))
                .append($('<span/>').addClass('ticket-multiplier').html(''))
                .append($('<span/>').addClass('ticket-quantity').html(''));
}
function CreatePrintTickets(ticket) {
    var quantity = typeof ticket.quantity === 'undefined' ? 1 : ticket.quantity;
    var todaysDate = new Date();
    
    var ticketHTML = ['<div class="ticket">',
                            '<div class="main">',
                                '<header><img src="images/ioCinemaIcon.png" /><span class="header-title">I/0 Cinema 10</span></header>',
                                '<div class="ticket-content">',
                                    '<div class="theater"><span class="title">Theater:</span><span class="theater-name">' + CurrentSession.showing.theater.name + '</span></div>',
                                    '<div class="movie"><span class="ticket-movie-title title">' + CurrentSession.showing.movie.title + '</span></div>',
                                    '<div class="rating"><span class="title">Rating:</span><span class="ticket-rating">' + CurrentSession.showing.movie.rating + '</span></div>',
                                    '<div class="time"><span class="title">Showing:</span><span class="ticket-time">' + CurrentSession.showing.time + '</span></div>',
                                    '<div class="date"><span class="admission-date title">' + CurrentSession.showing.date + '</span></div>',
                                    '<div class="admission-data">',
                                        '<div class="admission-data-item admission"><span class="title">Admit:</span>1 <span class="ticket-type">' + ticket.ticketType.name + '</span></div>',
                                        '<div class="admission-data-item price"><span class="title">Price:</span><span class="ticket-price">' + FormatCurrency(ticket.price) + '</span></div>',
                                    '</div>',
                                    '<div class="cinema-data">',
                                        '<div class="cinema-data-item id"><span class="title">ID:</span><span class="ticket-id">' + CurrentSession.receipt.id + '</span></div>',
                                        '<div class="cinema-data-item issue"><span class="title">Issued:</span><span class="ticket-issue-data">' + todaysDate.getHours() + ':' + todaysDate.getMinutes() + ":" + todaysDate.getSeconds() + ' ' + todaysDate.getMonth() + '/' + todaysDate.getDay() + '/' + todaysDate.getFullYear() + '</span></div>',
                                        '<div class="cinema-data-item issuer"><span class="title">By:</span><span class="ticket-issuer">Kiosk</span></div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div class="stub">',
                                '<header></header>',
                                '<div class="ticket-content">',
                                    '<div class="theater"><span class="title">Theater:</span><span class="theater-name">' + CurrentSession.showing.theater.name + '</span></div>',
                                    '<div class="date"><span class="admission-date title">' + CurrentSession.showing.date + '</span></div>',
                                    '<div class="time"><span class="title">Showing:</span><span class="ticket-time">' + CurrentSession.showing.time + '</span></div>',
                                    '<div class="movie"><span class="ticket-movie-title title">' + CurrentSession.showing.movie.title + '</span></div>',
                                    '<div class="admission">1 <span class="ticket-type">' + ticket.ticketType.name + '</span></div>',
                                    '<div class="cinema-data">',
                                        '<div class="cinema-data-item id"><span class="title">ID:</span><span class="ticket-id">' + CurrentSession.receipt.id + '</span></div>',
                                        '<div class="cinema-data-item issue"><span class="title">Issued:</span><span class="ticket-issue-data">' + todaysDate.getHours() + ':' + todaysDate.getMinutes() + ":" + todaysDate.getSeconds() + ' ' + todaysDate.getMonth() + '/' + todaysDate.getDay() + '/' + todaysDate.getFullYear() + '</span></div>',
                                        '<div class="cinema-data-item issuer"><span class="title">By:</span><span class="ticket-issuer">Kiosk</span></div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                      '</div>'];
    var ticketHTMLString = ticketHTML.join('');
    
    $('#page-print-tickets .tickets-container').append(ticketHTMLString);
    
    
//    
//    return $('<div/>').addClass('ticket')
//                .append($('<span/>').addClass('ticket-movie-title').html(CurrentSession.showing.movie.title))
//                .append($('<span/>').addClass('ticket-time').html(CurrentSession.showing.time))
//                .append($('<span/>').addClass('ticket-type').html(ticket.ticketType.name))
//                .append($('<span/>').addClass('ticket-price').html(FormatCurrency(ticket.price)))
//                .append($('<span/>').addClass('ticket-multiplier').html('x'))
//                .append($('<span/>').addClass('ticket-quantity').html(quantity));
}
function ShowPurchaseOption(option) {
    $.each($('#page-purchase .purchase-option-forms .purchase-option-form'), function() {
        if ($(this).hasClass(option)) {
            if (!$(this).is(':visible')) {
                $(this).show(PURCHASE_SLIDE);
            }
        }
        else if ($(this).is(':visible')) {
            $(this).hide(PURCHASE_SLIDE);
        }
    });
}

function PrintHTML(html) {
    //TODO: This will likely change, need a chromebook in Kiosk mode to test
    chrome.app.window.create('blank.html', function(createdWindow) {
        var w = createdWindow.contentWindow;
        //createdWindow.hide();
        w.onload = function() {
            var content = w.document.getElementById('content');
            content.innerHTML = html;
            w.print();
            createdWindow.close();
        };
    });
    
    return true;
}


/*******************************************************************************
 * Prerequisite Functions (Must be called before page loads)
 ******************************************************************************/
function Prerequisite_Movies() {
    $('#page-movies .movies-carousel').empty();
    for (var i = 0; i < data.movies.length; i++) {
        $('#page-movies .movies-carousel').append(data.movies[i].getCarouselDiv());
    }

    //add listeners to view movie show times
    $('#page-movies .movie').unbind('click').click(Movies_ViewShowTimes_ClickHandler);
}
function Prerequisite_Movie(movie) {
    movie.setMovieData($('#page-movie'));

    $('#page-movie .showings').empty();
    var movieShowings = data.getShowingsByMovie(movie);
    for (var i = 0; i < movieShowings.length; i++) {
        $('#page-movie .showings').append(movieShowings[i].getShowingButton());
    }

    //add listeners to view movie show times
    $('#page-movie .showings').unbind('click').click(Movie_MovieShowing_ClickHandler);
}
function Prerequisite_Showing() {
    var pageShowing = $('#page-showing');
    CurrentSession.showing.movie.setMovieData(pageShowing);
    CurrentSession.showing.setShowingData(pageShowing);
    CurrentSession.showing.theater.setTheaterData(pageShowing);

    AddTicket(true);
}
function Prerequisite_Purchase() {
    var receipt = new Receipt(CurrentSession.showing);
    CurrentSession.receipt = receipt;

    $.each($('#page-showing .showing-tickets .ticket'), function() {
        var ticketForm = $(this);
        var ticketType = $('.ticket-type option:selected', ticketForm).val();
        var ticket;
        var tickets = CurrentSession.showing.theater.pricing.tickets;
        for (var i = 0; i < tickets.length; i++) {
            if (tickets[i].ticketType.name === ticketType) {
                ticket = tickets[i];
                break;
            }
        }
        var quantity = parseInt($('.ticket-quantity', ticketForm).html());

        for (var i = 0; i < quantity; i++) {
            receipt.tickets.push(ticket);
        }
    });

    $('#page-purchase .tickets').replaceWith(CreateTicketSummary());
    ShowPurchaseOption('none');
}
function Prerequisite_Purchase_Results() {
    //Assume successful transaction
    spreadsheet.saveReceipt(CurrentSession.receipt.createStorageObject());

    $('#page-purchase-results .purchase-status').html('Purchase Successful');

    $('#page-purchase-results .tickets').replaceWith(CreateTicketSummary());

    $('#page-purchase-results .payment-type').html(CurrentSession.receipt.paymentType);
    $('#page-purchase-results .payment-type-info').html(CurrentSession.receipt.paymentTypeInfo);
}
function Prerequisite_Print_Tickets() {  
    $('#page-print-tickets .tickets-container').empty();
    var receipt = CurrentSession.receipt;
    for (var i = 0; i < receipt.tickets.length; i++)
    {
        CreatePrintTickets(receipt.tickets[i]);
        //.appendTo($('#page-print-tickets .tickets-container'));
    }
}
function Prerequisite_Printing() {
    PrintHTML($('#page-print-tickets .tickets-container').html());
}
function Prerequisite_Search() {
    $('#page-ticket-search .receipt-input').val('');
    SetButtonStatus($('#page-ticket-search .retrieve'), ValidateConfirmationCodeFormat, '');
    console.log('prereq done');
}


/*******************************************************************************
 * Misc Helper Functions 
 ******************************************************************************/
function ValidateConfirmationCodeFormat(validationString)
{
    var regex = /^\d{2}-\d{3}$/;
    return regex.test(validationString);
}
function FormatCurrency(value, hideSign)
{
    if(hideSign == true)
    {
        return parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
    }
    
    return '$' + parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function FormatDecimalFromCurrency(value)
{
    return parseFloat(value.substr(1));
}

/*******************************************************************************
 * Listeners and Event Handlers
 ******************************************************************************/
function AddListeners()
{
    $('#page-initial .purchase-tickets').click(Initial_PurchaseTickets_ClickHandler);
    $('#page-initial .print-tickets').click(Initial_PrintTickets_ClickHandler);
    $('#page-movie').on(slider.Event.BEFORE_OPEN, function() {
        console.log('movie before open');
    });
    $('#page-movie').on(slider.Event.AFTER_OPEN, function() {
        console.log('movie after open');
    });
    $('#page-movie').on(slider.Event.BEFORE_CLOSE, function() {
        console.log('movie before close');
    });
    $('#page-movie').on(slider.Event.AFTER_CLOSE, function() {
        console.log('movie after close');
    });
    $('#page-movie').on(slider.Event.AFTER_CLOSE, Movie_AfterCloseHandler);
    $('#page-showing .purchase-tickets').click(Showing_PurchaseTickets_ClickHandler);
    $('#page-showing .add-tickets').click(Showing_AddTickets_ClickHandler);
    $('#page-purchase .payment-method-option.cash').click(Purchase_Cash_ClickHandler);
    $('#page-purchase .payment-method-option.card').click(Purchase_Card_ClickHandler);
    $('#page-purchase .payment-method-option.gift').click(Purchase_Gift_ClickHandler);
    $('#page-purchase').on(swiper.EVENT_NAME, Purchase_CardSwiped);
    swiper.addTrigger($('#page-purchase'));
    $('#page-purchase-results .print-tickets').click(PurchaseResults_PrintTickets_ClickHandler);
    
    $('#page-ticket-search').on(slider.Event.BEFORE_OPEN, TicketSearch_BeforeOpen);
    $('#page-ticket-search').on(slider.Event.AFTER_CLOSE, TicketSearch_AfterClose);
    $('#page-ticket-search .receipt-input').keyup(TicketSearch_Receipt_KeyUpHandler);
    $('#page-ticket-search .retrieve').click(TicketSearch_Retrieve_ClickHandler);
    swiper.addTrigger($('#page-ticket-search'));
    
    $('#page-print-tickets .print-tickets').click(PrintTickets_PrintTickets_ClickHandler);
    
    $('.return-main-menu').unbind('click').click(ReturnMainMenu_ClickHandler);
    $('.return-movies').unbind('click').click(ReturnMovies_ClickHandler);
    $('.return-movie').unbind('click').click(ReturnMovie_ClickHandler);
    $('.return-showing').unbind('click').click(ReturnShowing_ClickHandler);
}

//Event Handlers
function Initial_PurchaseTickets_ClickHandler(e)
{
    slider.navigateTo('#page-movies', slider.Direction.RIGHT, Prerequisite_Movies);
    $('body > header').css('visibility', 'visible');
}
function Initial_PrintTickets_ClickHandler(e)
{
    slider.navigateTo('#page-ticket-search', slider.Direction.RIGHT, Prerequisite_Search);
    $('body > header').css('visibility', 'visible');
}
function Movies_ViewShowTimes_ClickHandler(e)
{
    var movieID = $(e.target).closest('.movie').attr('data-id');
    slider.navigateTo('#page-movie', slider.Direction.RIGHT, Prerequisite_Movie, data.getMovieByID(movieID));
}
function Movie_MovieShowing_ClickHandler(e)
{
    var showingID = $(e.target).closest('.showing').attr('data-id');
    CurrentSession.showing = data.getShowingByID(showingID);
    slider.navigateTo('#page-showing', slider.Direction.RIGHT, Prerequisite_Showing);
}
function Movie_AfterCloseHandler(e)
{
    $(this).removeData('movie');
}
function Showing_AddTickets_ClickHandler(e)
{
    AddTicket();
}
function Showing_DeleteTickets_ClickHandler(e)
{
    var ticketID = $(this).closest('.ticket').attr('data-id');
    RemoveTicket(ticketID);
}
function Showing_TicketType_ChangeHandler(e)
{
    UpdateTickets();
}
function Showing_TicketQuantityIncrease_ClickHandler(e) 
{
    var ticketID = $(e.target).closest('.ticket').attr('data-id');
    ModifyTicketQuantity(ticketID, true);
}
function Showing_TicketQuantityDecrease_ClickHandler(e) 
{
    var ticketID = $(e.target).closest('.ticket').attr('data-id');
    ModifyTicketQuantity(ticketID, false);
}
function Showing_PurchaseTickets_ClickHandler(e)
{
    slider.navigateTo('#page-purchase', slider.Direction.RIGHT, Prerequisite_Purchase);
}
function Purchase_Cash_ClickHandler(e) 
{
    CurrentSession.receipt.paymentType = 'Cash';
    swiper.scanning = false;
    ShowPurchaseOption('cash');
}
function Purchase_Card_ClickHandler(e) 
{
    CurrentSession.receipt.paymentType = 'Credit';
    swiper.scanning = true;
    $('#page-purchase .purchase-option-form.card header').html('Please Swipe Your Credit Card');
    ShowPurchaseOption('card');
}
function Purchase_Gift_ClickHandler(e) 
{
    CurrentSession.receipt.paymentType = 'Gift';
    swiper.scanning = true;
    $('#page-purchase .purchase-option-form.gift header').html('Please Swipe Your Gift Card');
    ShowPurchaseOption('gift');
}
function Purchase_CashPurchase_ClickHandler(e)
{
    //Payment verification logic
    CurrentSession.receipt.paymentType = 'Cash';
    CurrentSession.receipt.paymentTypeInfo = 'Change Due: $0.00';
    slider.navigateTo('#page-purchase-results', slider.Direction.RIGHT, Prerequisite_Purchase_Results);
}
function Purchase_CardSwiped(e, card) 
{
    if (card.isValid()) {
        //TODO: After checking valid swipe, send card info to payment processing
        CurrentSession.receipt.paymentObject = card;
        CurrentSession.receipt.paymentTypeInfo = 'Card Charged: xxxx-xxxx-xxxx-' + card.getLast4();
        
        swiper.scanning = false;
        
        slider.navigateTo('#page-purchase-results', slider.Direction.RIGHT, Prerequisite_Purchase_Results);
    }
    else {
        $('#page-purchase .purchase-option-form.card header').html('Invalid Card, Please Try Again');
        $('#page-purchase .purchase-option-form.gift header').html('Invalid Card, Please Try Again');
    }
}
function PurchaseResults_PrintTickets_ClickHandler(e)
{
    slider.navigateTo('#page-print-tickets', slider.Direction.RIGHT, Prerequisite_Print_Tickets);
}
function TicketSearch_BeforeOpen(e) {
    console.log('scanning beforeopen');
    swiper.scanning = true;
}
function TicketSearch_AfterClose(e) {
    console.log('scanning stopped');
    swiper.scanning = false;    
}
function TicketSearch_Receipt_KeyUpHandler(e)
{
    //TODO: Auto-detect valid format (XX-XXX) where X is digits, add dash
    var button = $('#page-ticket-search .retrieve');
    SetButtonStatus(button, ValidateConfirmationCodeFormat, $(e.target).val());
}
function TicketSearch_Retrieve_ClickHandler(e)
{
    //TODO: Loading animation?
    swiper.scanning = false;
    var receiptId = $('#page-ticket-search .receipt-input').val();
    spreadsheet.getReceiptById(receiptId, TicketSearch_Results);
}
function TicketSearch_Swiped(e, card) 
{
    //TODO: Loading animation?
    swiper.scanning = false;
    spreadsheet.getReceiptByCard(card, TicketSearch_Results);
}
function TicketSearch_Results(receiptStore) 
{
    if (receiptStore) {
        CurrentSession.receipt.id = receiptStore.id;
        CurrentSession.receipt.showing.theater.name = receiptStore.theater;
        CurrentSession.receipt.showing.movie.title = receiptStore.movie;
        CurrentSession.receipt.showing.movie.rating = receiptStore.rating;
        CurrentSession.receipt.showing.time = receiptStore.time;
        CurrentSession.receipt.showing.date = receiptStore.date;
        for (var i = 0; i < receiptStore.stubs.length; i++) {
            CurrentSession.receipt.tickets.push({
                ticketType: {
                    name: receiptStore.stubs[i].type
                },
                price: receiptStore.stubs[i].price
            });
        }
        slider.navigateTo('#page-print-tickets', slider.Direction.RIGHT, Prerequisite_Print_Tickets);
    }
    else {
        //TODO: Alert invalid receipt ID/Card swipe
        console.log('Invalid receipt ID or Card');
        swiper.scanning = true;
    }
}
function PrintTickets_PrintTickets_ClickHandler(e)
{
    slider.navigateTo('#page-print-results', slider.Direction.RIGHT, Prerequisite_Printing);
}

function ReturnMainMenu_ClickHandler(e)
{
    CurrentSession = new Session();
    
    //get new hero image
    var randomNumber = Math.floor(Math.random() * 12) + 1;
    var imageNumber = '001';
    if(randomNumber >= 10)
    {
        imageNumber = '0' + randomNumber.toString();
    }
    else
    {
        imageNumber = '00' + randomNumber.toString();
    }

    var imageName = imageNumber + '.png';
    $('#page-initial .hero-image').attr('src', 'images/hero-images/' + imageName);
    
    slider.navigateTo('#page-initial', slider.Direction.LEFT);
}
function ReturnMovies_ClickHandler(e)
{
    slider.navigateTo('#page-movies', slider.Direction.LEFT, Prerequisite_Movies);
}
function ReturnMovie_ClickHandler(e)
{
    slider.navigateTo('#page-movie', slider.Direction.LEFT);
}
function ReturnShowing_ClickHandler(e)
{
    slider.navigateTo('#page-showing', slider.Direction.LEFT);
}

function PrerequisiteComplete(e)
{
    var targetPage = $(e.target);
    OpenPage('#' + targetPage.attr('id'), targetPage.data('slidePosition'));
    targetPage.removeData('slidePosition');
}



function SetButtonStatus(button, validationFunction, validationString)
{
    var isValid = validationFunction(validationString);
    if(isValid)
    {
        button.removeAttr('disabled');
    }
    else
    {
        button.attr('disabled', 'disabled');
    }
}