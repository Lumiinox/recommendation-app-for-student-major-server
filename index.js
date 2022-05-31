const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "skripsi_database_soal"
})

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

db.connect((err) => {
    if(err){
        console.log(err)
    }
    console.log('MySQL Connected');
})

app.post('/api/login-student', (req, res) => {
    console.log('login api called');
    email   = req.body.email;
    password = req.body.password;
    console.log(email);
    console.log(password);
    const sqlLogin = "SELECT NIM, Nama, status FROM student WHERE email = ? and password = ?;"
    db.query(sqlLogin, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(result);
    })
})

app.post('/api/login-admin', (req, res) => {
    console.log('login api called');
    email   = req.body.email;
    password = req.body.password;
    console.log(email);
    console.log(password);
    const sqlLogin = "SELECT email, id_Admin, Nama, status FROM admin WHERE email = ? and password = ?;"
    db.query(sqlLogin, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        console.log(result);
        res.send(result);
    })
})

app.get('/api/get/questions', (req, res) => {
    console.log("question api called")
    const sqlSelect = "SELECT * FROM skripsi_database_soal.questions;";
    db.query(sqlSelect, (err, result) =>{
        console.log(result);
        res.send(result);
    })
});

app.get('/api/get/questions-random', (req, res) => {
    console.log("random question api called")
    const kodeTipe = "Personality";
    const sqlSelect = 
        "SELECT * FROM skripsi_database_soal.questions WHERE code_type = ? ORDER BY RAND() LIMIT 5;";
    db.query(sqlSelect, [kodeTipe], (err, result) =>{
        console.log(result);
        res.send(result);
    })
});

app.post('/api/insert/question/', (req, res) => {
    console.log('insert api called');
    const kodeSoal      = req.body.kodeSoal;
    const kodeTipe      = req.body.kodeTipe;
    const pertanyaan    = req.body.pertanyaan;
    const pilihan1      = req.body.pilihan1;
    const pilihan2      = req.body.pilihan2;
    const pilihan3      = req.body.pilihan3;
    const pilihan4      = req.body.pilihan4;
    const kunciJawaban  = req.body.kunciJawaban;

    const sqlInsert = "INSERT INTO soal (kode_soal, kode_tipe, pertanyaan, pilihan_1, pilihan_2, pilihan_3, pilihan_4, kunci_jawaban) VALUES (?,?,?,?,?,?,?,?);";
    db.query(sqlInsert, [kodeSoal, kodeTipe, pertanyaan, pilihan1, pilihan2, pilihan3, pilihan4, kunciJawaban], (err, result) =>{
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
    const sqlInsertTest = "INSERT INTO test_result(NIM, score, test_date, code_Type) VALUES (?,?,?,?);";
    db.query(sqlInsertTest, [NIM, score, dateTime, codeType], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    })
})

app.post('/api/insert/question_history', (req, res) => {
    console.log("question_history inserted");
    const value_to_be_inserted = req.body.value_to_be_inserted;
    const sqlInsertQuestionHistory = "INSERT INTO questions_history (question_id, test_id, test_answer, correctness) VALUES " + value_to_be_inserted + ";";
    db.query(sqlInsertQuestionHistory, (err, result) => {
        if (err) console.log(err);
        console.log("Inserted");
        res.send(true);
    })
})

app.get('/api/get/test_id/:nim/:dateTime', (req, res) => {
    console.log("get test_id api called");
    const dateTime = req.params.dateTime;
    const nim = req.params.nim;
    console.log(dateTime);
    console.log(nim);
    const getTestIdQuery = "SELECT test_id FROM test_result WHERE test_date = ? AND nim = ?;";
    db.query(getTestIdQuery, [dateTime, nim], (err, result) => {
        if (err) console.log(err);
        console.log("Inserted")
        console.log(result);
        res.send(result);
    })
})

app.listen(3001, () => {
    console.log('Server started on Port 3001');
})
//