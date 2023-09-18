# Employee-review-system
This application has following features with three views
1. Admin view
```sh
Add/remove/update/view employees
Add/update/view performance reviews
Assign employees to participate in another employee's performance review
```

## How to setup 
1. To use this repository your machine should have [node](https://nodejs.org/en/), npm, [monogodb](https://docs.mongodb.com/manual/installation/) and [git](https://git-scm.com/downloads). to check version exicute these.
```go
node --version
npm --version
git --version
```
2. Now clone this repository
```go
git clone https://github.com/gauravkjha123/employee-review-sys.git
```
3. Change directory to Ecomerce-API
```go
cd employee-review-sys
```

3. Install dependencies
```go
npm install 
```
4. Start mongo db this command may differ... system to system.
```go
sudo systemctl start mongod
```
5. That's... it  run the application
```go
npm start
```
## File structure
here you are looking at directory structure with root level files only.
```sh
employee-review-sys
├── public
│   ├── images
│   ├── js
│   ├── css
│
├── node-modules
├── configs
├── controllers
├── enum
├── errors
├── lib
├── middlwere
├── models
├── validations
├── package-lock.json
├── package.json
├── readme.md
├── routes
└── views
```