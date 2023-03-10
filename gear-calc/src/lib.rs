use std::f64::consts::PI;
// use svg::node::element::path::Data;
// use svg::node::element::{Circle, Path};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

const INVOLUTE_RES: usize = 16;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct Point(pub f64, pub f64);

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Points {
    points: Vec<Point>,
    index: usize,
}

impl Points {
    fn new(points: Vec<Point>) -> Self {
        Points { points, index: 0 }
    }
    fn push(&mut self, point: Point) {
        self.points.push(point);
    }
}

impl Iterator for Points {
    type Item = Point;
    fn next(&mut self) -> Option<Self::Item> {
        if self.index < self.points.len() {
            let result = self.points[self.index];
            self.index += 1;
            Some(result)
        } else {
            None
        }
    }
}

/* fn gen_circle(
    x_translate: f64,
    scale: f64,
    y_translate: f64,
    base_circle_radius: f64,
    color: &str,
) -> Circle {
    let circle = Circle::new()
        .set("cx", x_translate * scale)
        .set("cy", y_translate * scale)
        .set("r", base_circle_radius * scale)
        .set("stroke", color)
        .set("stroke-width", "0.1")
        .set("fill", "none");
    circle
} */

fn rotate(x: f64, y: f64, theta: f64) -> Point {
    // Rotates points x and y around origin by theta degrees
    let x_rot = x * theta.cos() - y * theta.sin();
    let y_rot = y * theta.cos() + x * theta.sin();
    Point(x_rot, y_rot)
}

fn calculate_intersect(
    left_tooth_x: [f64; INVOLUTE_RES+1],
    left_tooth_y: [f64; INVOLUTE_RES+1],
    p0: usize,
    p1: usize,
    outer_diameter: f64,
) -> Point {
    // Calculate the intersection point between the last segment of the involute and the outer circle
    // Accepts the index of the last point within the outer circle and the index of the first point outside of the outer circle
    let x_0 = left_tooth_x[p0];
    let y_0 = left_tooth_y[p0];
    let x_1 = left_tooth_x[p1];
    let y_1 = left_tooth_y[p1];
    // println!("{:?},{:?}, {outer_diameter}",(x_0,y_0),(x_1,y_1));
    // Make line connecting both points: y=mx+k
    let m = (y_1 - y_0) / (x_1 - x_0);
    let k = y_0 - m * x_0;
    // Make quadratic equation by substituting the previous equation as y in x^2+y^2 =r^2: x^2+(mx+k)^2=r^2
    let a = m.powi(2) + 1.0;
    let b = 2.0 * k * m;
    let c = k.powi(2) - (outer_diameter / 2.0).powi(2);
    // Solve quadratic equation for x
    let disc = (b.powi(2) - (4.0 * a * c)).sqrt();
    let pos_x = (-1.0 * b) / (2.0 * a) + disc / (2.0 * a);
    let neg_x = (-1.0 * b) / (2.0 * a) - disc / (2.0 * a);
    // Select intersection point closest to the points because the quadratic will return two values
    let intersect_x = if x_0 > 0.0 { pos_x } else { neg_x };
    let intersect_y = m * intersect_x + k;
    Point(intersect_x, intersect_y)
}

fn bruh() -> String {
    "bruh".to_string()
}

#[wasm_bindgen]
pub fn test(num: f64) -> String {
    format!("things: {}, {}", num,bruh())
}

#[wasm_bindgen]
pub fn make_gear(num_teeth: usize, pitch_diameter: f64) -> String {
    // User specifies tooth count, and pitch diameter
    // Calculate important measurements: pitch, tooth thickness, module, addendum, dedendum, root diameter, outer diameter, base diameter, alpha angle, beta angle
    let pressure_angle = 20.0_f64.to_radians();
    let tooth_pitch = (PI * pitch_diameter) / num_teeth as f64;
    let module = tooth_pitch / PI;
    let addendum = module;
    let dedendum = 1.25 * module;
    let root_diameter = pitch_diameter - 2.0 * dedendum;
    let outer_diameter = pitch_diameter + 2.0 * addendum;
    let base_diameter = pitch_diameter * pressure_angle.cos();
    let alpha_angle =
        ((pitch_diameter.powi(2) - base_diameter.powi(2)).sqrt() / base_diameter) - pressure_angle;
    let beta_angle = 2.0 * ((2.0 * PI) / (4.0 * (num_teeth as f64)) - alpha_angle);

    // Generate points for all teeth
    let mut profile_points: Points = Points::new(vec![]);
    for i in 0..num_teeth {
        let mut tooth: Points = make_tooth(
            base_diameter,
            beta_angle,
            outer_diameter,
            root_diameter,
            num_teeth,
        );
        // Rotates teeth if needed
        let theta = -1.0 * (i as f64) * ((2.0 * PI) / (num_teeth as f64));
        for point in &mut tooth {
            let rotated = rotate(point.0, point.1, theta);
            profile_points.push(Point(rotated.0+outer_diameter/2.0, rotated.1+outer_diameter/2.0));
        }
    }
    let mut string = format!(
        "M{},{}",
        profile_points.points[0].0, profile_points.points[0].1
    );
    for point in profile_points {
        string += &format!(" L{},{}", point.0, point.1);
    }
    string += " z";
    string
    // JsValue::from(profile_points)
}

pub fn make_tooth(
    base_diameter: f64,
    beta: f64,
    outer_diameter: f64,
    root_diameter: f64,
    num_teeth: usize,
) -> Points {
    // Instead of generating one tooth and figuring out how much space to put on each side, generate one half of two adjacent teeth (left tooth and right tooth)
    // Generates right half of the left tooth and then the left half of the right tooth. The right tooth is generated while accounting for space in between teeth

    // Points of left tooth
    let mut left_tooth_x = [0.0; INVOLUTE_RES+1];
    let mut left_tooth_y = [0.0; INVOLUTE_RES+1];
    // Lower points of the tooth
    let mut right_tooth_x = [0.0; INVOLUTE_RES+1];
    let mut right_tooth_y = [0.0; INVOLUTE_RES+1];

    for i in 0..=INVOLUTE_RES {
        let t = ((i as f64)/INVOLUTE_RES as f64)*0.9;
        // println!("{}",t);
        let r = base_diameter / 2.0;
        // Calculate involute curve for left tooth
        left_tooth_x[i] = r * (t.cos() + t * t.sin());
        left_tooth_y[i] = r * (t.sin() - t * t.cos());
        // Calculate involute curve for right tooth, using the beta angle to accomodate for space between gears
        right_tooth_x[i] = r * ((-t - beta).cos() - t * (-t - beta).sin());
        right_tooth_y[i] = r * ((-t - beta).sin() + t * (-t - beta).cos());
    }

    // Combine all previous arrays in a vector because some points would fall outside the outer circle
    let mut all_points: Points = Points::new(vec![]);

    // Append left tooth points
    let mut last_in_bounds = 0;
    for i in 0..INVOLUTE_RES {
        let x = left_tooth_x[i];
        let y = left_tooth_y[i];
        let distance = (x.powi(2) + y.powi(2)).sqrt();
        if distance <= outer_diameter / 2.0 {
            all_points.push(Point(x, y));
            last_in_bounds = i;
        }
    }
    // Due to sampling of the curve, some portion of it at the end will be missing
    // The point that contains the last part of the curve fall outside of the outside circle, causing the involute to end abruptly
    // This interpolates a point that the involute would intersect with the outside circle
    let mut first_out_bounds = last_in_bounds - 1;
    let top_fill = calculate_intersect(
        left_tooth_x,
        left_tooth_y,
        last_in_bounds,
        first_out_bounds,
        outer_diameter,
    );
    // The loop is reversed so that the svg draws a line at the bottom of the curves
    all_points.points.push(top_fill);
    all_points.points.reverse();
    if root_diameter < base_diameter {
        all_points.push(Point(
            (root_diameter / 2.0) * (0.0 * -2.0 * PI / num_teeth as f64).cos(),
            (root_diameter / 2.0) * (0.0 * -2.0 * PI / num_teeth as f64).sin(),
        ));
    }
    // Append right tooth points
    if root_diameter < base_diameter {
        all_points.push(Point(
            (root_diameter / 2.0) * (-1.0 * beta).cos(),
            (root_diameter / 2.0) * (-1.0 * beta).sin(),
        ));
    }
    for i in 0..INVOLUTE_RES {
        let x = right_tooth_x[i];
        let y = right_tooth_y[i];
        let distance = (x.powi(2) + y.powi(2)).sqrt();
        if distance <= outer_diameter / 2.0 {
            all_points.push(Point(x, y));
            last_in_bounds = i;
        }
    }
    first_out_bounds = last_in_bounds + 1;
    all_points.push(calculate_intersect(
        right_tooth_x,
        right_tooth_y,
        last_in_bounds,
        first_out_bounds,
        outer_diameter,
    ));
    all_points
}

// Function obsolete because it was only used in debugging

/* fn plot_gear(all_data: String, /* tcx: Vec<f64>, tcy: Vec<f64> */) {
    let teeth_path = Path::new()
        .set("fill", "none")
        .set("stroke", "black")
        .set("stroke-width", 0.2)
        .set("d", all_data);
    let mut document = svg::Document::new();
    document = document
        .add(teeth_path)
        .set("viewBox", (0, 0, 200, 200));

    svg::save("image.svg", &document).unwrap();
} */