/**
 * @fileOverview Ticket class
 */

/**
 * The Ticket class represents a TicketType and its associated price.
 * <p>
 * TicketTypes can be universal, such as "Adult" or "Child", but the price for 
 * each Ticket can change depending on the Theater type.
 * @param {TicketType} ticketType
 * @param {number} price
 * @returns {Ticket}
 */
function Ticket(ticketType, price) {
    
    /**
     * The TicketType of this Ticket
     * @type {TicketType}
     */
    this.ticketType = typeof ticketType === 'undefined' ? new TicketType() : ticketType;
    /**
     * The price of this Ticket, defaults to 0
     * @type number
     */
    this.price = typeof price === 'undefined' ? 0.00 : parseFloat(price);
    /**
     * The ID of this Ticket, defaults to a random XX-XXX format, where X is 
     * any numerical digit.
     * @type {string}
     */
    this.id = (Math.floor(Math.random() * 99) + 10).toString() + '-' + (Math.floor(Math.random() * 999) + 100).toString();
}