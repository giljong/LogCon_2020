const express = require('express');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const db = require('../db/connection');
const crypto = require('crypto');
const router = express.Router();

router.post('/',(req,res) => {
    const tmpId = req.body.id;
    const pw = req.body.pw;
    const tmpEmail = req.body.email + req.body.domain;
    const tmpSchool = req.body.school;
    const tmpGrade = req.body.grade;
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    const tmpPwd = crypto.createHash('sha512').update(pw).digest('base64');
    if(pw!==req.body.check){
        res.send('<script type="text/javascript">alert("비밀번호를 확인해주세요!(*•̀ᴗ•́*)");window.location.href="/";</script>');
    }
    else if(tmpId===''||tmpPwd===''||tmpEmail===''||tmpSchool === ''||tmpGrade === ''||req.body.check==='')
        res.send('<script type="text/javascript">alert("입력되지 않은 값이 있어요!ᵒ̌ ᴥ ᵒ̌");window.location.href="/";</script>');
    else if(pw.length<8||pw.length>20||tmpId.length>20||tmpId.length<5)
        res.send('<script type="text/javascript">alert("아이디나 패스워드의 길이를 맞춰주세요!(´ヘ｀()");window.location.href="/";</script>');
    else if(tmpId.indexOf(' ') !== -1){
        res.send('<script type="text/javascript">alert("아이디에는 공백이 들어가면 안돼요!ʅ( ՞ਊ՞)ʃ≡");window.location.href="/";</script>');
    }
    else{
        db.query('select SCORE from Users where ID = ?', tmpId, (err, result) => {
			if(err) console.error(err);
			if(!(result.length===0))
                res.send('<script type="text/javascript">alert("중복되는 아이디에요!(•⊙ω⊙•)");window.location.href="/";</script>');
            else{
                db.query('select SCORE from Users where EMAIL = ?',tmpEmail, (error,results) => {
                    if(error) throw error;
                    if(!(results.length===0))
                        res.send('<script type="text/javascript">alert("중복되는 이메일이에요!( ･ὢ･ )");window.location.href="/";</script>');
                    else{
                        const authkey = randomstring.generate();
                        db.query('insert into Users (ID,PW,EMAIL,SCHOOL,AUTHKEY,GRADE) values (?,?,?,?,?,?)',[tmpId,tmpPwd,tmpEmail,tmpSchool,authkey,tmpGrade]);
                        res.send('<script type="text/javascript">alert("회원가입 성공!ヾ|๑╹◡╹๑|ﾉ");window.location.href="/";</script>');
                        const transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'minjong5054@gmail.com', 
                                pass: 'pj83918332'
                            }
                        });
                        const mailOptions = {
                            from: 'TeamLog',
                            to: tmpEmail ,
                            subject: 'LOGCON 인증',
                            text: '가입완료를 위해 <'+authkey+'> 를 입력해주세요'
                        };
                        transporter.sendMail(mailOptions, (err, response) => {
                            if(err)
                                console.log(err);  
                            else
                                console.log(response,time + ' - '+ ip ); 
                        })   
                    }
                })
            }
        })
    }
})

module.exports = router;
