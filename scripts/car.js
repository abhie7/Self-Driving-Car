class Car {
  constructor(x, y, width, height) {
    this.x = x; // x position
    this.y = y; // y position
    this.width = width; // width of the car
    this.height = height; // height of the car

    this.speed = 0; // speed of the car
    this.acceleration = 0.2; // acceleration of the car
    this.maxSpeed = 3; // maximum speed of the car
    this.friction = 0.05; // friction of the car
    this.angle = 0; // angle of the car
    this.damaged = false; // is the car damaged?

    this.sensor = new Sensor(this); // sensor object
    this.controls = new Controls(); // controls object
  }

  update(roadBorders) {
    // update the car's position (method)
    if (!this.damaged) {
      // if the car is damaged, it will stop moving
      this.#move();
      this.polygon = this.#createPolygon(); // create the polygon
      this.damaged = this.#assessDamage(roadBorders); // assess the damage
    }
    this.sensor.update(roadBorders);
  }

  #assessDamage(roadBorders) {
    // private method
    for (let i = 0; i < roadBorders.length; i++) {
      // for each road border
      if (polysIntersect(this.polygon, roadBorders[i])) {
        // if the car intersects the road border
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    // private method
    const points = []; // array of points
    const radius = Math.hypot(this.width, this.height) / 2; // get the radius
    const alpha = Math.atan2(this.width, this.height); // get the angle between the center of the car and the top right corner
    points.push({
      // add the points to the array
      x: this.x - Math.sin(this.angle - alpha) * radius, // x position
      y: this.y - Math.cos(this.angle - alpha) * radius, // y position
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });
    return points; // return the array
  }

  #move() {
    // private method
    if (this.controls.forward) {
      this.speed += this.acceleration; // increase the speed
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration; // decrease the speed
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; // speed = maxSpeed
    }
    if (this.speed < -this.maxSpeed / 2) {
      //for reverse
      this.speed = -this.maxSpeed / 2; // limit speed
    }

    if (this.speed > 0) {
      this.speed -= this.friction; // apply friction
    }
    if (this.speed < 0) {
      this.speed += this.friction; // apply friction
    }
    if (Math.abs(this.speed) < this.friction) {
      // if the speed is less than the friction
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? -1 : 1; // if the speed is positive, flip = 1, else flip = -1
      if (this.controls.right) {
        this.angle += 0.03 * flip; // rotate the car
      }
      if (this.controls.left) {
        this.angle -= 0.03 * flip; // rotate the car
      }
    }

    this.x -= Math.sin(this.angle) * this.speed; // move the car
    this.y -= Math.cos(this.angle) * this.speed; // move the car
    // this.y -= this.speed; // move the car
  }

  draw(ctx) {
    // ctx.save(); // save the current state of the canvas
    // ctx.translate(this.x, this.y); // move the canvas to the car's position
    // ctx.rotate(-this.angle); // rotate the canvas
    // ctx.beginPath(); // begin drawing
    // ctx.rect(
    //   // draw a rectangle
    //   -this.width / 2,
    //   -this.height / 2,
    //   this.width,
    //   this.height
    // );
    // ctx.fill();

    // ctx.restore(); // restore the canvas to the last saved state

    if (this.damaged) {
      // if the car is damaged
      ctx.fillStyle = "#6e6e6e"; // set the color to gray
    } else {
      ctx.fillStyle = "black"; // set the color to black
    }

    ctx.beginPath(); // begin drawing
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y); // move to the first point
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill(); // finish drawing

    this.sensor.draw(ctx); // draw the sensor
  }
}
