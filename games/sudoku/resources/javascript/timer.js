function Timer() {
    this.running = false;
    this.minutes = 0;
    this.seconds = 0;
    this.hours = 0;
    this.increaseSeconds = 1;
    this.timer = null;
}

Timer.prototype.start = function() {
    this.running = true;
    let self = this;
    let startTime = new Date().getTime();
    let counter = 0,
        speed = 1000;

    this.timer = setTimeout(function() { instance(); }, 0);

    function instance() {
        //work out the real and ideal elapsed time
        let real = (counter * speed),
            ideal = (new Date().getTime() - startTime);

        counter++;
        // increment the time
        self.seconds += self.increaseSeconds;
        if (self.seconds >= 60) {
            self.minutes += 1;
            if (self.minutes == 60) {
                self.hours += 1;
                self.minutes = 0;
            }
            self.seconds = 0;
        }

        //calculate the difference
        let diff = (ideal - real);

        self.timer = setTimeout(function() { instance(); }, (speed - diff));
    };

}

Timer.prototype.stop = function() {
    clearTimeout(this.timer);
}

Timer.prototype.getTime = function() {
    return {
        seconds: this.seconds,
        minutes: this.minutes,
        hours: this.hours,
        totalTimeInSeconds: this.seconds + (this.minutes * 60) + (this.hours * 3600)
    }
}

Timer.prototype.increaseTimeBy = function(seconds) {
    this.increaseSeconds = seconds;
}

Timer.prototype.initializeMeasures = function() {
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
}