## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Running the app

```bash
# development
$ docker-compse up -d

# production mode
$ ./build_local.sh
$ docker-compose -f docker-compose.production.yml up -d

# create user
$ ./create_user.sh your_email your_password
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
