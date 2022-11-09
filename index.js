const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const app = express()

const db = require("./db.js");

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/api/login_student', (req, res) => {
    console.log('login api called');
    email   = req.body.email;
    password = req.body.password;
    console.log(email);
    console.log(password);
    const sqlLogin = "SELECT NIM, nameStudent, status FROM student WHERE emailStudent = ? and passStudent = ?;"
    db.query(sqlLogin, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(result);
    })
})

app.post('/api/login_admin', (req, res) => {
    console.log('login api called');
    email   = req.body.email;
    password = req.body.password;
    console.log(email);
    console.log(password);
    const sqlLogin = "SELECT emailAdmin, idAdmin, nameAdmin, status FROM admin WHERE emailAdmin = ? and passAdmin = ?;"
    db.query(sqlLogin, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(result);
    })
})

app.post('/api/insert/question/', (req, res) => {
    console.log('insert api called');
    const code_type     = req.body.code_type;
    const questionText  = req.body.questionText;
    const choice_1      = req.body.choice_1;
    const choice_2      = req.body.choice_2;
    const choice_3      = req.body.choice_3;
    const choice_4      = req.body.choice_4;
    const answer        = req.body.answer;

    const sqlInsert = "INSERT INTO question (idCategory, questionText, questionChoice1, questionChoice2, questionChoice3, questionChoice4, answer) VALUES (?,?,?,?,?,?,?);";
    db.query(sqlInsert, [code_type, questionText, choice_1, choice_2, choice_3, choice_4, answer], (err, result) =>{
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(true);
    })
})

app.post('/api/insert/test_result', (req, res) => {
    console.log('test_result api called');
    const NIM = req.body.nim;
    const score = req.body.score;
    const dateTime = req.body.dateTime;
    const codeType = req.body.codeType;
    const sqlInsertTest = "INSERT INTO test_result(NIM, idCategory, testDate, testCore) VALUES (?,?,?,?);";
    db.query(sqlInsertTest, [NIM, codeType, dateTime, score], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    })
})

app.post('/api/insert/question_history', (req, res) => {
    console.log("question_history inserted");
    const value_to_be_inserted = req.body.value_to_be_inserted;
    const sqlInsertQuestionHistory = "INSERT INTO question_history (idQuestion, idQuiz, quizAnswer, AnswerCorrectness) VALUES " + value_to_be_inserted + ";";
    db.query(sqlInsertQuestionHistory, (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    })
})

app.post('/api/new_question_category', (req, res) => {
    console.log('login api called');
    categoryName   = req.body.nameCategory;
    console.log(categoryName);
    const sqlQuery = "INSERT INTO question_category (nameCategory) VALUES (?);"
    db.query(sqlQuery, [categoryName], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    })
})

app.get('/api/get/question_category_all', (req, res) => {
    const sqlQuery = "SELECT * FROM question_category;";
    console.log("testing");
    db.query(sqlQuery, (err, result) => {
        console.log(result);
        res.send(result);
    })
})


app.get('/api/get/admin', (req, res) => {
    const sqlQuery = "SELECT * FROM admin;";
    console.log("testing");
    db.query(sqlQuery, (err, result) => {
        console.log(result);
        res.send(result);
    })
})

app.get('/api/get/question', (req, res) => {
    console.log("question api called")
    const sqlSelect = "SELECT * FROM question;";
    db.query(sqlSelect, (err, result) =>{
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
});

app.get('/api/get/question_random/:codeType', (req, res) => {
    console.log("random question api called")
    const code_type = req.params.codeType;
    const sqlSelect = 
        "SELECT * FROM question WHERE idCategory = ? ORDER BY RAND() LIMIT 5;";
    db.query(sqlSelect, [code_type], (err, result) =>{
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
});

app.get('/api/get/question_category/:idCategory', (req, res) => {
    const idCategory = req.params.idCategory;
    const sqlLogin = "SELECT * FROM questions_category WHERE idCategory = ?;";
    console.log("testing");
    db.query(sqlLogin, [idCategory], (err, result) => {
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
})

app.get('/api/get/test_id/:nim/:dateTime', (req, res) => {
    console.log("get test_id api called");
    const dateTime = req.params.dateTime;
    const nim = req.params.nim;
    console.log(dateTime);
    console.log(nim);
    const getTestIdQuery = "SELECT idTest FROM test_result WHERE testDate = ? AND NIM = ?;";
    db.query(getTestIdQuery, [dateTime, nim], (err, result) => {
        if (err) console.log(err);
        console.log("Data Received")
        console.log(result);
        res.send(result);
    })
})

app.get('/api/get/test_result', (req, res) => {
    console.log("get_test_result");
    const getTestResultQuery = "SELECT * FROM v_test_result_name;";
    db.query(getTestResultQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
})

app.get('/api/get/question_stat', (req, res) => {
    console.log("get question stat");
    const getQuestionStatbyId = "SELECT * FROM v_questions_with_stats;";
    db.query(getQuestionStatbyId, (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
})
