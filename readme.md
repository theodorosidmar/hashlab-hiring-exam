> Exam for [Hashlab hiring](https://github.com/hashlab/hiring/blob/master/challenges/pt-br/back-challenge.md)

## Running
```bash
> docker-compose up --build
```

## See
* `products-service` [readme](https://github.com/theodorosidmar/hashlab-hiring-exam/blob/master/products-service/readme.md)
* `discounts-service` [readme](https://github.com/theodorosidmar/hashlab-hiring-exam/blob/master/discounts-service/readme.md)


## Discussing points
* gRPC Server running insecurely;
* Logging all services;
* Environment variables management (not hardcoded in docker-compose maybe);
* Proto files share/management (in case of update);
* Better gRPC server request validations;
* Error handlers;
* Scalability;
* Why mongoDB?
