const express=require('express');
const users=require('./students');
const path=require('path');
const app=express();
const idFilter = req => member => member.id === parseInt(req.params.id);
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
const PORT=3001;
app.listen(PORT, () => console.log('Server is Running ${PORT}'));
//GET ALL
app.get('/api/users',(req,res)=>res.json(users));
//GET TABLE
app.get('/api/users/table', (req, res) => {
    const tableHtml = `
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
            </tr>
        </thead>
        <tbody>
            ${users.map(student => `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.branch}</td>
                    <td>${student.year}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;

    res.send(tableHtml);
});
//GET Specific USER based on id
app.get('/api/users/:id', (req, res) => {
    const found = users.some(idFilter(req));
    if (found) {
    res.json(users.filter(idFilter(req)));
    } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
    });
// GET Specific Student Based on ID in table format
app.get('/api/users/:id/view', (req, res) => {
    const studentId = parseInt(req.params.id); // Extract the employee ID from the request parameters
    const student = users.find(stu => stu.id === studentId); // Find the employee with the specified ID

    if (student) {
        const tableHtml = `
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Branch</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.branch}</td>
                    <td>${student.year}</td>
                </tr>
            </tbody>
        </table>`;

        res.send(tableHtml); // Send the HTML code for the table as the response
    } else {
        res.status(404).json({ msg: `Student with ID ${employeeId} not found` }); // If employee is not found, send a 404 response with an error message
    }
});
//CREATE A NEW USER
app.post('/api/users',(req,res)=>{
    const newMember={
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    branch: req.body.branch,
    year: req.body.year
    };
    if(!newMember.name || !newMember.email ||  !newMember.branch || !newMember.year){
    return res.status(400).json({msg:'NAME,EMAIL,BRANCH,YEAR Must be provided'});
    }
    users.push(newMember);
    res.json(users);
    }
    );
//DELETE Specific USER Based on ID
app.delete('/api/users/:id', (req, res) => {
    const found = users.some(idFilter(req));
    if (found) {
    res.json({msg:'Deleted',
    members:users.filter(
    member=>member.id!==parseInt(req.params.id))})
    } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
    });
//UPDATE Specific USER Based on ID
app.put('/api/users/:id',(req,res)=>
{
const found = users.some(member=>member.id===parseInt(req.params.id));
if(found)
{
const updMember=req.body;
users.forEach(
member=>{
if(member.id===parseInt(req.params.id))
{
member.name=updMember ? updMember.name : member.name;
member.email=updMember.email ? updMember.email : member.email;
member.branch=updMember ? updMember.branch : member.branch;
member.year=updMember ? updMember.year : member.year;
res.json({msg:'Updated Details',member})
}
}
);
}
else{
res.status(400).json({msg:'No User found with ${req.params.id}'});
}
});