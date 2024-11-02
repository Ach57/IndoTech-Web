require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10; // Number of salt rounds for bcrypt
const cookieParser = require('cookie-parser'); // cookie parser
const User = require('./public/js/user');
const { default: mongoose } = require('mongoose');
const { updateUserRole } = require('./updateRole');
const AcceptedTask = require('./public/js/task');
const http = require('http')
const socketIo = require('socket.io')


const app = express();
const server = http.createServer(app)
const io = socketIo(server)
const uri = process.env.MONGO_URI;

const confirmedTasks =[]



// Connect to MongoDB using Mongoose
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Could not connect to MongoDB Atlas...', err);
        process.exit(1); // Exit the process if the connection fails
    });


//Use cookie-parser
app.use(cookieParser());

app.use(bodyParser.json())

//Set the view enjine to EJS
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies (e.g., from AJAX requests)
app.use(express.json());


//set the directory for EJS templates
app.set('views', path.join(__dirname, 'EJS'));


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Routes

// Middleware to check for cookie expiration and set status to offline
app.use(async (req, res, next) => {
    const loggedIn = req.cookies.loggedIn;
    const username = req.cookies.username;

    if (!loggedIn && username) {
        // If the loggedIn cookie is missing, set the user status to offline
        await User.findOneAndUpdate({ username }, { status: 'offline' });
        res.clearCookie('username'); // Clear the username cookie as well
    }
    
    next();
});


app.get('/', async (req, res) => {
    
    const loggedIn = req.cookies.loggedIn
    if (loggedIn) {
        const username = req.cookies.username;
        try {
            const user = await User.findOne({ username });

            if (user) {
                // Redirect based on user role
                if (user.role === 'admin' ) {
                    return res.render('admin', {username: username,
                        isLoggedIn:true, message: ''
                    } );
                } else if (user.role === 'employee') {
                    return res.render('employee', {username: username,
                        isLoggedIn:true, message: ''});
                }
            }
        } catch (err) {
            console.error('Error finding user:', err);
        }
    }

    // If not logged in, render the login/register page
    res.render('index', { registerMessage: '',
         loginMessage: '',
        isLoggedIn:false,
        forgot_pass_message: '' });
});

app.post('/register', async (req, res)=>{
     // Handle registration logic here
    try{
        const { username, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] }); // find if the user already exists

        if( existingUser){
            return res.render('index', {registerMessage: 'Username or email already in use',
                loginMessage: '', isLoggedIn: false, forgot_pass_message:''
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
             email,
            password: hashedPassword,
            role: role|| 'employee', //default role is set to employee
        });

        await newUser.save(); // await until the newUser is saved
        
        // Render the registration page with a success message
        res.render('index', { registerMessage: 'User registered successfully',
            loginMessage: '',
            isLoggedIn:false,
            forgot_pass_message:'',
         });

    } catch(error){
        // if an error occurs during the operation
        console.error('Registration error:', error);
        res.render('index', { registerMessage: 'Error registering user',
            loginMessage: '',
            isLoggedIn:false,
            forgot_pass_message:''

         });
    }


});




app.get('/admin', (req, res)=>{
    const username = req.cookies.username;
    const loggedIn = req.cookies.username;
    if (loggedIn) {
        // Render the admin page and pass the username to the template
        res.redirect('/');
        
    }else{
        // If the username cookie doesn't exist, redirect to the login page or handle it accordingly
        res.render('index', { registerMessage: '',
        loginMessage: '',
        isLoggedIn:false,
        forgot_pass_message: ''
     });
    }
    

    

});


app.post('/addadmin', async (req, res) => {
    const loggedIn = req.cookies.loggedIn;
    const username = req.cookies.username;

    if (loggedIn) {
        const targetUsername  = req.body.newAdmin; // Only need the target username from the form
        if(targetUsername === username){
            return  res.render('admin', {username: username,
                isLoggedIn:true, message: "You are already set to Admin" });
        }
        const newRole = 'admin'; // Hardcode the new role as 'admin'

        const result = await updateUserRole(targetUsername, newRole);

        // Render a page with the message
        res.render('admin', {username: username,
            isLoggedIn:true, message: result.message });
    } else {
        // Redirect to the login page if not logged in
        res.redirect('/');
    }
});

app.get('/sendrequest',(req, res) =>{
    const username = req.cookies.username;
    const loggedIn = req.cookies.loggedIn;  
    if(loggedIn){
        res.render('sendrequest', {username: username})
    }else{
        res.render('index', { registerMessage: '',
            loginMessage: '',
            isLoggedIn:false,
            forgot_pass_message:''
         });
    }
});

app.get('/Inventory',(req, res)=>{
    const username = req.cookies.username;
    const loggedIn = req.cookies.loggedIn;

    if(loggedIn){
        res.render('Inventory', {username: username})
    }else{
        res.render('index', { registerMessage: '',
            loginMessage: '',
            isLoggedIn:false,
            forgot_pass_message: ''
         });
    }


});



app.post('/forgot-password', async (req, res)=>{
    try{
        const {username} = req.body;
        const user = await User.findOne({username: username})
        if(!user){
            res.render('index', { registerMessage: '',
                loginMessage: '',
                isLoggedIn:false,
                forgot_pass_message: 'This user is not found'
             });
        } else{
            const email = user.email;
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenHashed = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetToken = resetTokenHashed;
            user.resetTokenExpiration = Date.now() + 5 * 60 * 1000; 
            await user.save();

            const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
            const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;   
        }
        
    } catch(error){
        console.error('Error handling the request: ', error)
        res.status(500).send('Internal Server error');
    }
});




app.get('/Review',(req, res)=>{
    const loggedIn = req.cookies.loggedIn;
    const username = req.cookies.username;

    if(loggedIn){
        const tasksToShow = [...confirmedTasks]
        confirmedTasks.length = 0;
        res.render('Review', {username: username, tasks:tasksToShow})
    }else{
        res.render('index', { registerMessage: '',
            loginMessage: '',
            isLoggedIn:false,
            forgot_pass_message: ''
         });
    }

})



app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.render('index', { registerMessage: '', loginMessage: 'User not found',
                isLoggedIn:false, forgot_pass_message: ''});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('index', { registerMessage: '', loginMessage: 'Incorrect password',
                isLoggedIn:false, forgot_pass_message: ''
             });
        }

        await User.findOneAndUpdate({username}, {status:'online'}) // set status of user to online in the database

        // Set a logged-in cookie
        const cookieOptions = {
            maxAge: 60 * 60 * 1000, 
            httpOnly: true,
        };
        res.cookie('loggedIn', true, cookieOptions);
        res.cookie('username', username, cookieOptions);

        // Redirect based on user role
        if (user.role === 'admin') {
            res.redirect('/');
        } else if (user.role === 'employee') {
            res.redirect('/');
        } else {
            res.render('index', { registerMessage: '', loginMessage: 'User role not recognized',
                isLoggedIn:false, forgot_pass_message: ''
             });
        }

    } catch (error) {
        console.error('Login Error: ', error);
        res.render('index', { registerMessage: '', loginMessage: 'Error Logging user',
            isLoggedIn:false, forgot_pass_message: ''
         });
    }
});



app.get('/logout', async (req,res)=>{
    const loggedIn = req.cookies.loggedIn;
    const username = req.cookies.username;
    
    if(loggedIn){
        //clear the cookie:
        await User.findOneAndUpdate({username}, {status:'offline'}) ; // set status of user offline
        res.clearCookie('loggedIn');
        res.clearCookie('username');
    }
    res.redirect('/');
})

app.get('/online-employees', async (req, res)=>{
    try{
        const onlineEmployees = await User.find({ role: 'employee', status: 'online' });
        res.json(onlineEmployees);
    } catch(error){
        console.error('Error fetching online employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.post('/submit-summary', (req, res)=>{

    const { doorType, doorCategory, part, type, length, quantity, projectNumber, onlineEmployee, estimatedTime, stockData } = req.body;
    console.log('Received data:', req.body);
    // Send notification via Socket.IO
    io.emit('new-summary', {
        onlineEmployee,
        doorType,
        doorCategory,
        part,
        type,
        length,
        quantity,
        projectNumber,
        estimatedTime,
        stockData
    });
    res.redirect('/admin');


});


app.post('/handle-task-action', async(req, res) => {
    const { action, doorType, doorCategory, part, type, length, quantity, projectNumber, estimatedTime, stockData, duration } = req.body;
    
    try {
        // Save the accepted task with the relevant status and duration
        const task = new AcceptedTask({
            doorType,
            doorCategory,
            part,
            type,
            length,
            quantity,
            projectNumber,
            estimatedTime,
            stockData,
            status: action,
            duration // Save the duration as well
        });

        await task.save();

        // Emit the task data to the admin dashboard
        io.emit('task-accepted', {
            taskId: task._id,
            doorType,
            doorCategory,
            part,
            type,
            length,
            quantity,
            projectNumber,
            estimatedTime,
            stockData,
            status: action,
            duration // Emit the duration
        });

        res.status(200).send('Task action handled successfully');
    } catch (error) {
        console.error('Error handling task action:', error);
        res.status(500).send('Error handling task action');
    }
});


app.post('/submit-confirmed-task', (req, res) => {
    const taskData = req.body;
    
    confirmedTasks.push(taskData);

    // Store or process the confirmed task data as needed, e.g., save it in a database
    console.log('Confirmed task received:', taskData);

    // Send a success response
    res.send({ success: true });
});

const PORT = process.env.PORT||3000;
const baseUrl = process.env.BASE_URL ||'http://localhost:'
server.listen(PORT, ()=>{

    console.log(`Server running at ${baseUrl}${PORT}`);
})

