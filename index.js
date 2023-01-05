const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express()

const db = require("./db.js");
const { application } = require('express')

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/api/login_student', (req, res) => {
    console.log('login api called');
    const email   = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    const sqlLogin = "SELECT * FROM student WHERE emailStudent = ? and passStudent = ?;"
    db.query(sqlLogin, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(result);
    });
});

app.post('/api/login_admin', (req, res) => {
    console.log('login api called');
    const email   = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    const sqlLogin = "SELECT * FROM admin WHERE emailAdmin = ? and passAdmin = ?;"
    db.query(sqlLogin, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        const userData = {
            idAdmin: result[0].idAdmin,
            nameAdmin: result[0].nameAdmin,
            emailAdmin: result[0].emailAdmin,
            status: result[0].status,
        }
        console.log(userData);
        console.log("TESTING");
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
        console.log("Access Token");
        console.log(accessToken);
        const userDataSend = {
            idAdmin: userData.idAdmin,
            nameAdmin: userData.nameAdmin,
            emailAdmin: userData.emailAdmin,
            status: userData.status,
            accessToken: accessToken,
        }
        res.send(userDataSend);
    });
});

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
    });
});

app.post('/api/insert/test_result', (req, res) => {
    console.log('test_result api called');
    const currentId = req.body.currentId;
    const idTest = req.body.idTest;
    const score = req.body.score;
    const dateTime = req.body.dateTime;
    const codeType = req.body.codeType;
    const sqlInsertTest = "INSERT INTO test_result(idStudent, idTest, idCategory, testDate, testScore) VALUES (?,?,?,?,?);";
    db.query(sqlInsertTest, [currentId, idTest, codeType, dateTime, score], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    });
});

app.post('/api/insert/question_history', (req, res) => {
    console.log("question_history inserted");
    const value_to_be_inserted = req.body.value_to_be_inserted;
    const sqlInsertQuestionHistory = "INSERT INTO question_history (idQuestion, idQuiz, quizAnswer, AnswerCorrectness) VALUES " + value_to_be_inserted + ";";
    db.query(sqlInsertQuestionHistory, (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    });
});

app.post('/api/new_question_category', (req, res) => {
    console.log('login api called');
    const categoryName   = req.body.nameCategory;
    console.log(categoryName);
    const sqlQuery = "INSERT INTO question_category (nameCategory) VALUES (?);"
    db.query(sqlQuery, [categoryName], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    });
});

app.post('/api/admin_registration', (req, res) => {
    console.log("admin registration api");
    const nameAdmin = req.body.nameAdmin;
    const emailAdmin = req.body.emailAdmin;
    const passAdmin = req.body.passAdmin;
    const sqlQuery = "INSERT INTO admin (nameAdmin, emailAdmin, passAdmin, status) VALUES (?,?,?,?);";
    db.query(sqlQuery, [nameAdmin, emailAdmin, passAdmin, 1], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    });
});

app.post('/api/student_registration', (req, res) => {
    console.log("student registration api");
    const nameStudent = req.body.nameStudent;
    const emailStudent = req.body.emailStudent;
    const passStudent = req.body.passStudent;
    console.log(nameStudent);
    console.log(emailStudent);
    console.log(passStudent);
    const sqlQuery = "INSERT INTO student (nameStudent, emailStudent, passStudent, status) VALUES (?,?,?,?);";
    db.query(sqlQuery, [nameStudent, emailStudent, passStudent, 2], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    });
});

app.post('/api/add-test', (req, res) => {
    console.log("student registration api");
    const idCategory = req.body.questionCategory;
    const questionAmount = req.body.numberOfQuestions;
    const timeAmount = req.body.testDuration;
    const nameTest = req.body.testName;
    console.log(idCategory);
    console.log(questionAmount);
    console.log(timeAmount);
    const sqlQuery = "INSERT INTO test (idCategory, questionAmount, timeAmount, nameTest, activeStatus) VALUES (?,?,?,?,1);";
    db.query(sqlQuery, [idCategory, questionAmount, timeAmount, nameTest], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(true);
    });
});


app.post('/api/delete/test-entry', (req, res) => {
    console.log("Delete Test Entries");
    const idTest = req.body.idTest;
    const sqlQuery = `DELETE FROM test WHERE idTest = ${idTest};`
    db.query(sqlQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Deleted");
        console.log(result);
        res.send(true);
    });
});

app.post('/api/delete/question-entry', (req, res) => {
    console.log("Delete Test Entries");
    const idQuestion = req.body.idQuestion;
    const sqlQuery = `DELETE FROM question WHERE idTest = ${idQuestion};`
    db.query(sqlQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Deleted");
        console.log(result);
        res.send(true);
    });
});

app.post('/api/deactivate/test-entry', (req, res) => {
    console.log("Entry Deactivate");
    const idTest = req.body.idTest;
    const sqlQuery = `UPDATE test SET activeStatus = 0 WHERE idTest = ${idTest};`;
    db.query(sqlQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Deactivated");
        console.log(result);
        res.send(true);
    });
});

app.post('/api/reactivate/test-entry', (req, res) => {
    console.log("Entry Reactovate");
    const idTest = req.body.idTest;
    const sqlQuery = `UPDATE test SET activeStatus = 1 WHERE idTest = ${idTest};`;
    db.query(sqlQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Reactivate");
        console.log(result);
        res.send(true);
    });
});

app.get('/api/get/question_category_all', (req, res) => {
    const sqlQuery = "SELECT * FROM question_category;";
    console.log("testing");
    db.query(sqlQuery, (err, result) => {
        console.log(result);
        res.send(result);
    });
});


app.get('/api/get/admin', (req, res) => {
    const sqlQuery = "SELECT * FROM admin;";
    console.log("testing");
    db.query(sqlQuery, (err, result) => {
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/question', (req, res) => {
    console.log("question api called")
    const sqlSelect = "SELECT * FROM question;";
    db.query(sqlSelect, (err, result) =>{
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/question_random/:codeType/:questionAmount', (req, res) => {
    console.log("random question api called")
    const code_type = req.params.codeType;
    const questionAmount = req.params.questionAmount;
    console.log(code_type);
    console.log(questionAmount);
    const sqlSelect = 
        `SELECT * FROM question WHERE idCategory = ${code_type} ORDER BY RAND() LIMIT ${questionAmount};`;
    db.query(sqlSelect, (err, result) =>{
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/question_category/:idCategory', (req, res) => {
    const idCategory = req.params.idCategory;
    const sqlLogin = "SELECT * FROM questions_category WHERE idCategory = ?;";
    console.log("testing");
    db.query(sqlLogin, [idCategory], (err, result) => {
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/test_id/:idStudent/:dateTime', (req, res) => {
    console.log("get test_id api called");
    const dateTime = req.params.dateTime;
    const idStudent = req.params.idStudent;
    console.log(dateTime);
    console.log(idStudent);
    const getTestIdQuery = "SELECT idTest FROM test_result WHERE testDate = ? AND idStudent = ?;";
    db.query(getTestIdQuery, [dateTime, idStudent], (err, result) => {
        if (err) console.log(err);
        console.log("Data Received")
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/test_result', (req, res) => {
    console.log("get_test_result");
    const getTestResultQuery = "SELECT * FROM v_test_result_name;";
    db.query(getTestResultQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/test_result/:idStudent', (req, res) => {
    const idStudent = req.params.idStudent;
    console.log("get_test_result");
    const getTestResultQuery = "SELECT * FROM v_test_result_with_test_name WHERE idStudent = ?;";
    db.query(getTestResultQuery, [idStudent], (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});


app.get('/api/get/test_result/:idStudent', (req, res) => {
    const idStudent = req.params.idStudent;
    console.log("get_test_result");
    const getTestResultQuery = "SELECT * FROM test_result WHERE idStudent = ?;";
    db.query(getTestResultQuery, [idStudent], (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/question_stat', authenticateToken, (req, res) => {
    console.log("get question stat");
    const getQuestionStatbyId = "SELECT * FROM v_questions_with_stats;";
    db.query(getQuestionStatbyId, (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    });
});

app.get('/api/get/test_data', (req, res) => {
    console.log('get test');
    const getTestDataQuery = "SELECT * FROM test";
    db.query(getTestDataQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
})

app.get('/api/get/active_test', (req, res) => {
    console.log('get test_list');
    const getTestListQuery = "SELECT * FROM test WHERE activeStatus = 1;";
    db.query(getTestListQuery, (err, result) => {
        if (err) console.log(err);
        console.log("Data Received");
        console.log(result);
        res.send(result);
    })
})

function authenticateToken(req, res, next){
    res.header("Access-Control-Allow-Origin", "authorization");
    const authHeader = req.headers['authorization'];
    console.log("AuthHead");
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        next();
    })
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
});
