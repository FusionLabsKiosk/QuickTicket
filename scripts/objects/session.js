function Session() {
    
    this.showing = new Showing();
    this.receipt = new Receipt(this);
}