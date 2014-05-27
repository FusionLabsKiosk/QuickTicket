function Session() {
    
    this.Showing = new Showing();
    this.Receipt = new Receipt(this);
}