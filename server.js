var express = require('express'),
	app = express(),
	http = require('http'),
	path = require('path'),
	mongoose = require('mongoose'),
	hash = require('./pass').hash;

mongoose.connect('mongodb://localhost/myapp');

mongoose.connection.on("open", function() {
	console.log('mongo connected');
});

var UserSchema = new mongoose.Schema({
	_id: String,
	username: String,
	password: String,
	salt: String,
	hash: String
});

var User = mongoose.model('users', UserSchema);

app.configure(function () {
	app.use(express.cookieParser());
    app.use(express.session({ secret: 'ytapp' }));
    app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/public');
    app.set('view engine', 'jade');
});


function authenticate(name, pass, fn) {

    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}

http.createServer(app).listen(process.env.PORT || 8080);
console.log('Server Started Successfully...');