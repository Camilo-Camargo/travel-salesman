#![deny(warnings)]

use http_body_util::{BodyExt, Full};
use hyper::body::{Buf, Bytes, Incoming};
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

#[derive(Serialize, Deserialize, Debug)]
struct SuccessResponse<T> {
    success: bool,
    data: T,
}

#[derive(Serialize, Deserialize, Debug)]
struct ErrorResponse {
    success: bool,
    error: ErrorDetails,
}

#[derive(Serialize, Deserialize, Debug)]
struct ErrorDetails {
    message: String,
}

type ShareMatrix = Arc<Mutex<Matrix>>;

async fn post_matrix(req: Request<Incoming>, matrix: ShareMatrix) -> Result<Response<BoxBody>> {
    let whole_body = req.collect().await?.aggregate();
    let data: Matrix = match serde_json::from_reader(whole_body.reader()) {
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

    let mut m = matrix.lock().unwrap();
    m.matrix = data.matrix;
    m.cities = data.cities;

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

async fn get_matrix(_: Request<Incoming>, shared_matrix: ShareMatrix) -> Result<Response<BoxBody>> {
    let matrix = shared_matrix.lock().unwrap();

    let sucess = SuccessResponse {
        success: true,
        data: &*matrix,
    };

    let res = match serde_json::to_string(&sucess) {
        Ok(json) => {
            Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(json))
            .unwrap()
        },

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

async fn router(req: Request<Incoming>, matrix: ShareMatrix) -> Result<Response<BoxBody>> {
    match (req.method(), req.uri().path()) {
        (&Method::POST, "/matrix") => post_matrix(req, matrix).await,
        (&Method::GET, "/matrix") => get_matrix(req, matrix).await,
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

    let matrix = Arc::new(Mutex::new(Matrix {
        cities: vec![],
        matrix: vec![],
    }));

    loop {
        let shared_matrix = matrix.clone();
        let (stream, _) = listener.accept().await?;

        let io = TokioIo::new(stream);

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(
                    io,
                    service_fn(move |req| router(req, shared_matrix.clone())),
                )
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
