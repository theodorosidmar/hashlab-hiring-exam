> Service responsible for applying discounts.

* `gRPC` Ruby Server
* `Protocol buffers` files at `./app/pb`
* Discounts logics on `app/lib/get_pct`

### By date of birth
* No discounts when 29/02;
* 50% when it's birthday;
* 20% when it's his month of birth;
* 10% anyways

### Testing
```
$ rspec
```