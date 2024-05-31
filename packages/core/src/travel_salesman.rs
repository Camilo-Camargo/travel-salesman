use rand::seq::SliceRandom;
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone)]
struct TravelNode {
    lat: f64,
    lng: f64,
    name: String,
}

#[derive(Debug)]
struct TravelPath {
    to: Vec<usize>,
    distances: Vec<f64>,
}

#[derive(Debug)]
struct TravelRoute {
    from: TravelNode,
    to: TravelNode,
    distance: f64,
    price: f64,
}

fn find_routes() {
    let cities: Vec<TravelNode> = vec![
        TravelNode {
            lat: 5.53528,
            lng: -73.36778,
            name: "Tunja".to_string(),
        },
        TravelNode {
            lat: 4.60971,
            lng: -74.08175,
            name: "Bogota".to_string(),
        },
        TravelNode {
            lat: 7.12539,
            lng: -73.1198,
            name: "Bucaramanga".to_string(),
        },
        TravelNode {
            lat: 6.25184,
            lng: -75.56359,
            name: "Yopal".to_string(),
        },
        TravelNode {
            lat: 6.25184,
            lng: -75.56359,
            name: "Medellin".to_string(),
        },
    ];

    let mut paths: HashMap<usize, TravelPath> = HashMap::new();
    paths.insert(
        0,
        TravelPath {
            to: vec![1, 2],
            distances: vec![200.0, 250.0],
        },
    );

    paths.insert(
        1,
        TravelPath {
            to: vec![3, 2, 0],
            distances: vec![300.0, 200.0],
        },
    );

    paths.insert(
        2,
        TravelPath {
            to: vec![3, 1, 0],
            distances: vec![100.0, 250.0],
        },
    );

    paths.insert(
        3,
        TravelPath {
            to: vec![4, 1, 2],
            distances: vec![300.0, 100.0],
        },
    );

    paths.insert(
        4,
        TravelPath {
            to: vec![3],
            distances: vec![300.0, 100.0],
        },
    );

    // NOTE: the root is always the 0 position

    let mut routes: Vec<Vec<TravelRoute>> = Vec::new();
    let from: usize = 0;
    let to: usize = 4;

    let root = match paths.get(&from) {
        Some(p) => p,
        None => return (),
    };

    for _ in 1..10 {
        // TODO: generate randoms using congruential generator
        let mut rng = rand::thread_rng();
        let mut rs = root.to.clone();
        rs.shuffle(&mut rng);

        for &r in rs.iter() {
            let mut visited: Vec<usize> = Vec::new();
            let mut stack: Vec<usize> = Vec::new();
            let mut route_stack: Vec<usize> = Vec::new();
            let mut route_path: Vec<TravelRoute> = Vec::new();

            visited.push(from);
            stack.push(r);

            while let Some(n) = stack.pop() {
                let to_path = match paths.get(&n) {
                    Some(p) => p,
                    None => continue,
                };

                if visited.contains(&to) {
                    route_stack.pop();

                    let target_city = match cities.get(to) {
                        Some(p) => p,
                        None => continue,
                    };

                    let mut prev: usize = from;
                    for (i, &r1) in route_stack.iter().enumerate() {
                        let prev_city = match cities.get(prev) {
                            Some(p) => p,
                            None => continue,
                        };

                        let to_city = match cities.get(r1) {
                            Some(p) => p,
                            None => continue,
                        };

                        route_path.push(TravelRoute {
                            from: prev_city.clone(),
                            to: to_city.clone(),
                            distance: 0.0,
                            price: 0.0,
                        });

                        prev = r1;

                        if i == route_stack.len() - 1 {
                            let prev_city = match cities.get(prev) {
                                Some(p) => p,
                                None => continue,
                            };

                            route_path.push(TravelRoute {
                                from: prev_city.clone(),
                                to: target_city.clone(),
                                distance: 0.0,
                                price: 0.0,
                            });
                        }
                    }

                    break;
                }

                if visited.contains(&n) {
                    continue;
                }

                visited.push(n);
                route_stack.push(n);
                print!("{}", n);

                // TODO: generate randoms using congruential generator
                let mut rng = rand::thread_rng();
                let mut u = to_path.to.clone();
                u.shuffle(&mut rng);

                for &neighbor in u.iter() {
                    // BUG: here there is an error this is that when the array reach the target
                    // and should select another node the push was done and the program finished
                    // with a path that doesn't reach
                    stack.push(neighbor);
                }
            }

            // TODO: send notification
            println!("route: {:?}", route_stack);
            routes.push(route_path)
        }
    }

    println!("{:?}", routes.last());
}
