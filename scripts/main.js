//Global Vars
var SlidePosition = {
    LEFT : "left", 
    RIGHT : "right"
};

var TICKET_SLIDE = 200;
var PURCHASE_SLIDE = 200;
var SLIDE = 350;
var SLIDE_ANIMATION = 750;

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
function CreateTicketDiv(ticket) {
    var quantity = typeof ticket.Quantity === 'undefined' ? 1 : ticket.Quantity;
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
    var quantity = typeof ticket.Quantity === 'undefined' ? 1 : ticket.Quantity;
    var todaysDate = new Date();
    
    var ticketHTML = ['<div class="ticket">',
                            '<div class="main">',
                                '<header><img src="images/ioCinemaIcon.png" /><span class="header-title">I/0 Cinema 10</span></header>',
                                '<div class="ticket-content">',
                                    '<div class="theater"><span class="title">Theater:</span><span class="theater-name">' + CurrentSession.showing.theater.name + '</span></div>',
                                    '<div class="movie"><span class="ticket-movie-title title">' + CurrentSession.showing.movie.title + '</span></div>',
                                    '<div class="rating"><span class="title">Rating:</span><span class="ticket-rating">' + CurrentSession.showing.movie.rating + '</span></div>',
                                    '<div class="time"><span class="title">Showing:</span><span class="ticket-time">' + CurrentSession.showing.time + '</span></div>',
                                    '<div class="date"><span class="admission-date title">' + todaysDate.getMonth() + '/' + todaysDate.getDay() + '/' + todaysDate.getFullYear() + '</span></div>',
                                    '<div class="admission-data">',
                                        '<div class="admission-data-item admission"><span class="title">Admit:</span>1 <span class="ticket-type">' + ticket.ticketType.name + '</span></div>',
                                        '<div class="admission-data-item price"><span class="title">Price:</span><span class="ticket-price">' + FormatCurrency(ticket.price) + '</span></div>',
                                    '</div>',
                                    '<div class="cinema-data">',
                                        '<div class="cinema-data-item id"><span class="title">ID:</span><span class="ticket-id">' + ticket.id + '</span></div>',
                                        '<div class="cinema-data-item issue"><span class="title">Issued:</span><span class="ticket-issue-data">' + todaysDate.getHours() + ':' + todaysDate.getMinutes() + ":" + todaysDate.getSeconds() + ' ' + todaysDate.getMonth() + '/' + todaysDate.getDay() + '/' + todaysDate.getFullYear() + '</span></div>',
                                        '<div class="cinema-data-item issuer"><span class="title">By:</span><span class="ticket-issuer">Kiosk</span></div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div class="stub">',
                                '<header></header>',
                                '<div class="ticket-content">',
                                    '<div class="theater"><span class="title">Theater:</span><span class="theater-name">' + CurrentSession.showing.theater.name + '</span></div>',
                                    '<div class="date"><span class="admission-date title">' + todaysDate.getMonth() + '/' + todaysDate.getDay() + '/' + todaysDate.getFullYear() + '</span></div>',
                                    '<div class="time"><span class="title">Showing:</span><span class="ticket-time">' + CurrentSession.showing.time + '</span></div>',
                                    '<div class="movie"><span class="ticket-movie-title title">' + CurrentSession.showing.movie.title + '</span></div>',
                                    '<div class="admission">1 <span class="ticket-type">' + ticket.ticketType.name + '</span></div>',
                                    '<div class="cinema-data">',
                                        '<div class="cinema-data-item id"><span class="title">ID:</span><span class="ticket-id">' + ticket.id + '</span></div>',
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
    /*var w = chrome.app.window.create('blank.html').contentWindow;
    w.document.write('<html><head>');
    //Stylesheets
    w.document.write('<link rel="stylesheet" type="text/css" href="styles/print.css">');
    w.document.write('</head><body>');
    w.document.write(html);
    w.document.write('</body></html>');
    
    w.print();
    w.close();
    return true;*/
}


/*******************************************************************************
 * Prerequisite Functions (Must be called before page loads)
 ******************************************************************************/
function Prerequisite_Movies() {
    //timeout to allow for page transitions
    setTimeout(function() {
        $('#page-movies .movies-carousel').empty();
        for (var i = 0; i < data.movies.length; i++) {
            $('#page-movies .movies-carousel').append(data.movies[i].getCarouselDiv());
        }
        
        //add listeners to view movie show times
        $('#page-movies .movie').unbind('click').click(Movies_ViewShowTimes_ClickHandler);
        
        setTimeout(function(){$('#page-movies').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);
    }, SLIDE);
}
function Prerequisite_Movie(movie) {
    //timeout to allow for page transitions
    setTimeout(function() {
        movie.setMovieData($('#page-movie'));
        
        $('#page-movie .showings').empty();
        var movieShowings = data.getShowingsByMovie(movie);
        for (var i = 0; i < movieShowings.length; i++) {
            $('#page-movie .showings').append(movieShowings[i].getShowingButton());
        }
        
        //add listeners to view movie show times
        $('#page-movie .showings').unbind('click').click(Movie_MovieShowing_ClickHandler);
                
        setTimeout(function(){$('#page-movie').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);
        
    }, SLIDE);
}
function Prerequisite_Showing() {
    //timeout to allow for page transitions
    setTimeout(function() {
        var pageShowing = $('#page-showing');
        CurrentSession.showing.movie.setMovieData(pageShowing);
        CurrentSession.showing.setShowingData(pageShowing);
        CurrentSession.showing.theater.setTheaterData(pageShowing);
        
        AddTicket(true);
        
        setTimeout(function(){$('#page-showing').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);
        
    }, SLIDE);
}
function Prerequisite_Purchase() {
    //timeout to allow for page transitions
    setTimeout(function()
    {
        
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

        $('#page-purchase .tickets').empty();
        var ticketTotal = 0;
        var ticketQuantities = receipt.getTicketsWithQuantity();
        for (var i = 0; i < ticketQuantities.length; i++) {
            CreateTicketDiv(ticketQuantities[i]).appendTo($('#page-purchase .tickets'));
            ticketTotal += (ticketQuantities[i].price * ticketQuantities[i].Quantity);
        }
        CreateTicketTotalDiv('----------').addClass('tickets-total-line').appendTo($('#page-purchase .tickets'));
        CreateTicketTotalDiv(FormatCurrency(ticketTotal)).addClass('tickets-total').appendTo($('#page-purchase .tickets'));
        
        setTimeout(function(){$('#page-purchase').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);        
    }, SLIDE);
}
function Prerequisite_Purchase_Results() {
    //timeout to allow for page transitions
    setTimeout(function() {        
        //Assume successful transaction
        $('#page-purchase-results .purchase-status').html('Purchase Successful');
        
        $('#page-purchase-results .tickets').empty();
        $('#page-purchase-results .tickets').append($('#page-purchase .tickets'));
        
        $('#page-purchase-results .payment-type').html(CurrentSession.receipt.paymentType);
        $('#page-purchase-results .payment-type-info').html(CurrentSession.receipt.paymentTypeInfo);
        
        setTimeout(function(){$('#page-purchase-results').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);
    }, SLIDE);
}
function Prerequisite_Print_Tickets() {    
    //timeout to allow for page transitions
    setTimeout(function() {
        $('#page-print-tickets .tickets-container').empty();
        var receipt = CurrentSession.receipt;
        for (var i = 0; i < receipt.tickets.length; i++)
        {
            CreatePrintTickets(receipt.tickets[i]);
            //.appendTo($('#page-print-tickets .tickets-container'));
        }
        
        setTimeout(function(){$('#page-print-tickets').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);
    }, SLIDE);
}
function Prerequisite_Printing() {
    setTimeout(function() {
        PrintHTML($('#page-print-tickets .ticket-summary').html());
    
        setTimeout(function(){$('#page-print-results').trigger('prerequisiteComplete');}, SLIDE_ANIMATION);
    }, SLIDE);
}


/*******************************************************************************
 * Misc Helper Functions 
 ******************************************************************************/
function ValidateCardNumberFormat(validationString)
{
    if(validationString.length === 16)
    {
        if($.isNumeric(validationString))
        {
            return true;
        }
    }
    return false;
}
function ValidateConfirmationCodeFormat(validationString)
{
    if(validationString.length === 9)
    {
        return true;
    }
    return false;
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
    $('#page-movie').on('afterclose', Movie_AfterCloseHandler);
    $('#page-showing .purchase-tickets').click(Showing_PurchaseTickets_ClickHandler);
    $('#page-showing .add-tickets').click(Showing_AddTickets_ClickHandler);
    $('#page-purchase .payment-method-option.cash').click(Purchase_Cash_ClickHandler);
    $('#page-purchase .payment-method-option.card').click(Purchase_Card_ClickHandler);
    $('#page-purchase .payment-method-option.gift').click(Purchase_Gift_ClickHandler);
    $('#page-purchase').on(swiper.EVENT_NAME, Purchase_CardSwiped);
    swiper.addTrigger($('#page-purchase'));
    $('#page-purchase-results .print-tickets').click(PurchaseResults_PrintTickets_ClickHandler);
    $('#page-ticket-search .enter-confirmation-code').click(TicketSearch_EnterConfirmationCode_ClickHandler);
    $('#page-ticket-search .enter-credit-card').click(TicketSearch_EnterCreditCard_ClickHandler);
    $('#page-ticket-search .credit-card-number').keyup(TicketSearch_CreditCardNumber_KeyUpHandler);
    $('#page-ticket-search #credit-card-entry .retrieve-tickets').click(TicketSearch_CreditCard_RetrieveTickets_ClickHandler);
    $('#page-ticket-search .confirmation-code').keyup(TicketSearch_ConfirmationCode_KeyUpHandler);
    $('#page-ticket-search #confirmation-code-entry .retrieve-tickets').click(TicketSearch_ConfirmationCode_RetrieveTickets_ClickHandler);
    $('#page-print-tickets .print-tickets').click(PrintTickets_PrintTickets_ClickHandler);
    
    $('.return-main-menu').unbind('click').click(ReturnMainMenu_ClickHandler);
    $('.return-movies').unbind('click').click(ReturnMovies_ClickHandler);
    $('.return-movie').unbind('click').click(ReturnMovie_ClickHandler);
    $('.return-showing').unbind('click').click(ReturnShowing_ClickHandler);
}

//Event Handlers
function Initial_PurchaseTickets_ClickHandler(e)
{
    NavigateTo('#page-movies', SlidePosition.RIGHT, Prerequisite_Movies);
    $('body > header').css('visibility', 'visible');
}
function Initial_PrintTickets_ClickHandler(e)
{
    NavigateTo('#page-ticket-search', SlidePosition.RIGHT);
    $('body > header').css('visibility', 'visible');
}
function Movies_ViewShowTimes_ClickHandler(e)
{
    var movieID = $(e.target).closest('.movie').attr('data-id');
    NavigateTo('#page-movie', SlidePosition.RIGHT, Prerequisite_Movie, data.getMovieByID(movieID));
}
function Movie_MovieShowing_ClickHandler(e)
{
    var showingID = $(e.target).closest('.showing').attr('data-id');
    CurrentSession.showing = data.getShowingByID(showingID);
    NavigateTo('#page-showing', SlidePosition.RIGHT, Prerequisite_Showing);
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
    NavigateTo('#page-purchase', SlidePosition.RIGHT, Prerequisite_Purchase);
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
    NavigateTo('#page-purchase-results', SlidePosition.RIGHT, Prerequisite_Purchase_Results);
}
function Purchase_CardSwiped(e, card) 
{
    if (card.isValid()) {
        //TODO: After checking valid swipe, send card info to payment processing
        CurrentSession.receipt.paymentObject = card;
        CurrentSession.receipt.paymentTypeInfo = 'Card Charged: xxxx-xxxx-xxxx-' + card.getLast4();
        
        swiper.scanning = false;
        
        NavigateTo('#page-purchase-results', SlidePosition.RIGHT, Prerequisite_Purchase_Results);
    }
    else {
        $('#page-purchase .purchase-option-form.card header').html('Invalid Card, Please Try Again');
        $('#page-purchase .purchase-option-form.gift header').html('Invalid Card, Please Try Again');
    }
}
function PurchaseResults_PrintTickets_ClickHandler(e)
{
    NavigateTo('#page-print-tickets', SlidePosition.RIGHT, Prerequisite_Print_Tickets);
}
function TicketSearch_EnterConfirmationCode_ClickHandler(e)
{
    var page = $('#page-ticket-search');
    OpenSection(page, $('#confirmation-code-entry', page));
}
function TicketSearch_EnterCreditCard_ClickHandler(e)
{
    var page = $('#page-ticket-search');
    OpenSection(page, $('#credit-card-entry', page));
}
function TicketSearch_CreditCardNumber_KeyUpHandler(e)
{
    var button = $('#page-ticket-search #credit-card-entry .retrieve-tickets');
    SetButtonStatus(button, ValidateCardNumberFormat, $(e.target).val());
}
function TicketSearch_CreditCard_RetrieveTickets_ClickHandler(e)
{
    NavigateTo('#page-print-tickets', SlidePosition.RIGHT);
}
function TicketSearch_ConfirmationCode_KeyUpHandler(e)
{
    var button = $('#page-ticket-search #confirmation-code-entry .retrieve-tickets');
    SetButtonStatus(button, ValidateConfirmationCodeFormat, $(e.target).val());
}
function TicketSearch_ConfirmationCode_RetrieveTickets_ClickHandler(e)
{
    NavigateTo('#page-print-tickets', SlidePosition.RIGHT);
}
function PrintTickets_PrintTickets_ClickHandler(e)
{
    NavigateTo('#page-print-results', SlidePosition.RIGHT, Prerequisite_Printing);
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
    
    NavigateTo('#page-initial', SlidePosition.LEFT);
}
function ReturnMovies_ClickHandler(e)
{
    NavigateTo('#page-movies', SlidePosition.LEFT, Prerequisite_Movies);
}
function ReturnMovie_ClickHandler(e)
{
    NavigateTo('#page-movie', SlidePosition.LEFT);
}
function ReturnShowing_ClickHandler(e)
{
    NavigateTo('#page-showing', SlidePosition.LEFT);
}

function PrerequisiteComplete(e)
{
    var targetPage = $(e.target);
    OpenPage('#' + targetPage.attr('id'), targetPage.data('slidePosition'));
    targetPage.removeData('slidePosition');
}


/*******************************************************************************
 * Navigation Functions
 ******************************************************************************/
function NavigateTo(pageName, slidePosition, prerequisiteFunction, parameters)
{
    if (typeof prerequisiteFunction === 'undefined')
    {
        OpenPage(pageName, slidePosition);
    }
    else
    {
        OpenPage('#page-processing', slidePosition);
        $(pageName).on('prerequisiteComplete', PrerequisiteComplete);
        $(pageName).data('slidePosition', slidePosition);
        prerequisiteFunction(parameters);
    }
}

function OpenPage(pageName, slidePosition)
{
    var targetPage = $(pageName, '#pages');
    if(targetPage.length > 0)
    {
        targetPage.trigger('beforeopen');

        var newSlideClass = (slidePosition === SlidePosition.LEFT) ? 'slide-left' : 'slide-right';
        var newSlide = $('<div class="slide ' + newSlideClass + '"></div>');

        var currentSlideClass = (slidePosition === SlidePosition.LEFT) ? 'slide-right' : 'slide-left';
        var currentSlide = $('.slide-center');

        newSlide.appendTo('#slide-container');
        targetPage.detach().appendTo(newSlide);

        currentSlide.addClass(currentSlideClass);
        currentSlide.removeClass('slide-center');

        //close previous slide after transition
        setTimeout(function()
        {
            ClosePage('#' + $('.page', currentSlide).attr('id'));
            targetPage.trigger('closeComplete');
        }, 350);

        //stop 'pop in/out'
        setTimeout(function()
        {
            newSlide.addClass('slide-center');
            newSlide.removeClass(newSlideClass);
        }, 10);
        
        targetPage.trigger('afteropen');
    }
}
function ClosePage(pageName)
{
    var targetPage = $(pageName, '#slide-container');
    if(targetPage.length > 0)
    {
        targetPage.trigger('beforeclose');
        var parentSlide = targetPage.closest('.slide');
        targetPage.detach().appendTo('#pages');
        $('input[type="text"]', targetPage).val('');
        $('input[type="number"]', targetPage).val('1');
        parentSlide.remove();
        targetPage.trigger('afterclose');
    }
}

function OpenSection(page, section)
{
    CloseSections(page, section);;
    section.slideDown();
    section.addClass('open');
    
}
function CloseSections(page, section)
{
    $('section.open', page).slideUp().removeClass('open');
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