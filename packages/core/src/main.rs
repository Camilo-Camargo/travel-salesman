mod travel_salesman;
use travel_salesman::travelsalesman;

use http_body_util::{BodyExt, Full};
use hyper::body::{Buf, Bytes, Incoming};
use hyper::header::{ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS, ACCESS_CONTROL_ALLOW_ORIGIN};
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_util::rt::TokioIo;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use tokio::net::TcpListener;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type Result<T> = std::result::Result<T, GenericError>;
type BoxBody = http_body_util::combinators::BoxBody<Bytes, hyper::Error>;

static NOTFOUND: &[u8] = b"Not Found";

#[derive(Serialize, Deserialize)]
struct City {
    name: String,
    latitude: f64,
    longitude: f64,
}

#[derive(Serialize, Deserialize)]
struct Matrix {
    cities: Vec<City>,
    matrix: Vec<Vec<f64>>,
}

#[derive(Serialize, Deserialize)]
struct SuccessResponse<T> {
    success: bool,
    data: T,
}

#[derive(Serialize, Deserialize)]
struct ErrorResponse {
    success: bool,
    error: ErrorDetails,
}

#[derive(Serialize, Deserialize)]
struct ErrorDetails {
    message: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FindRoutesReq {
    from: String,
    to: String,
    fuel_cost: f64,
}

struct Data {
    matrix: Matrix,
}

type ShareData = Arc<Mutex<Data>>;

async fn post_matrix(req: Request<Incoming>, shared_data: ShareData) -> Result<Response<BoxBody>> {
    let whole_body = req.collect().await?.aggregate();
    let matrix: Matrix = match serde_json::from_reader(whole_body.reader()) {
        Ok(json) => json,
        Err(e) => {
            let err_res = ErrorResponse {
                success: false,
                error: ErrorDetails {
                    message: e.to_string(),
                },
            };

            return Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header(header::CONTENT_TYPE, "appplication/json")
                .body(full(serde_json::to_string(&err_res).unwrap()))
                .unwrap());
        }
    };

    let mut m = shared_data.lock().unwrap();
    m.matrix.matrix = matrix.matrix;
    m.matrix.cities = matrix.cities;

    let sucess = SuccessResponse {
        success: true,
        data: (),
    };

    let res = match serde_json::to_string(&sucess) {
        Ok(json) => Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(json))
            .unwrap(),
        Err(e) => {
            let err_res = ErrorResponse {
                success: false,
                error: ErrorDetails {
                    message: e.to_string(),
                },
            };

            Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header(header::CONTENT_TYPE, "application/json")
                .body(full(serde_json::to_string(&err_res).unwrap()))
                .unwrap()
        }
    };

    Ok(res)
}

async fn get_matrix(_: Request<Incoming>, shared_data: ShareData) -> Result<Response<BoxBody>> {
    let shared = shared_data.lock().unwrap();

    let sucess = SuccessResponse {
        success: true,
        data: &shared.matrix,
    };

    let res = match serde_json::to_string(&sucess) {
        Ok(json) => Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(json))
            .unwrap(),

        Err(_) => {
            let err_res = ErrorResponse {
                success: false,
                error: ErrorDetails {
                    message: "Error getting the current matrix".to_string(),
                },
            };

            Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header(header::CONTENT_TYPE, "application/json")
                .body(full(serde_json::to_string(&err_res).unwrap()))
                .unwrap()
        }
    };

    Ok(res)
}

async fn find_routes(req: Request<Incoming>, shared_data: ShareData) -> Result<Response<BoxBody>> {
    let whole_body = req.collect().await?.aggregate();
    let req: FindRoutesReq = match serde_json::from_reader(whole_body.reader()) {
        Ok(json) => json,
        Err(e) => {
            let err_res = ErrorResponse {
                success: false,
                error: ErrorDetails {
                    message: e.to_string(),
                },
            };

            return Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header(header::CONTENT_TYPE, "appplication/json")
                .body(full(serde_json::to_string(&err_res).unwrap()))
                .unwrap());
        }
    };

    let data = shared_data.lock().unwrap();

    let to_exists = data
        .matrix
        .cities
        .iter()
        .position(|c| c.name.to_lowercase() == req.to.to_lowercase());

    if to_exists == None {
        let err_res = ErrorResponse {
            success: false,
            error: ErrorDetails {
                message: "The to city doesn't exist".to_string(),
            },
        };

        return Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(serde_json::to_string(&err_res).unwrap()))
            .unwrap());
    }

    let from_exists = data
        .matrix
        .cities
        .iter()
        .position(|c| c.name.to_lowercase() == req.from.to_lowercase());

    if from_exists == None {
        let err_res = ErrorResponse {
            success: false,
            error: ErrorDetails {
                message: "The from city doesn't exist".to_string(),
            },
        };

        return Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(serde_json::to_string(&err_res).unwrap()))
            .unwrap());
    }

    // TODO: add multithreading to find the routes randomly
    let data = travelsalesman();

    let sucess = SuccessResponse {
        success: true,
        data: &data
    };

    let res = match serde_json::to_string(&sucess) {
        Ok(json) => Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(json))
            .unwrap(),

        Err(_) => {
            let err_res = ErrorResponse {
                success: false,
                error: ErrorDetails {
                    message: "Error getting the current matrix".to_string(),
                },
            };

            Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header(header::CONTENT_TYPE, "application/json")
                .body(full(serde_json::to_string(&err_res).unwrap()))
                .unwrap()
        }
    };

    Ok(res)
}

async fn handle_options_request() -> Result<Response<BoxBody>> {
    let response = Response::builder()
        .status(StatusCode::NO_CONTENT)
        .header(ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header(ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, OPTIONS")
        .header(ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type")
        .body(full(""))
        .unwrap();

    Ok(response)
}

async fn router(req: Request<Incoming>, data: ShareData) -> Result<Response<BoxBody>> {
    match (req.method(), req.uri().path()) {
        (&Method::POST, "/matrix") => post_matrix(req, data).await,
        (&Method::POST, "/find-routes") => find_routes(req, data).await,
        (&Method::GET, "/matrix") => get_matrix(req, data).await,
        (&Method::OPTIONS, _) => handle_options_request().await,
        _ => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(full(NOTFOUND))
            .unwrap()),
    }
}

fn full<T: Into<Bytes>>(chunk: T) -> BoxBody {
    Full::new(chunk.into())
        .map_err(|never| match never {})
        .boxed()
}

#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    let listener = TcpListener::bind(addr).await?;
    println!("Running at http://0.0.0.0:3000");

    let data = Arc::new(Mutex::new(Data {
        matrix: Matrix {
            cities: vec![],
            matrix: vec![],
        },
    }));

    loop {
        let shared_data = data.clone();
        let (stream, _) = listener.accept().await?;

        let io = TokioIo::new(stream);

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(move |req| router(req, shared_data.clone())))
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
