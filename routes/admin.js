const express = require('express');
const db = require('../db/connection');
const path = require('path');
const router  = express.Router();
const moment = require('moment');

router.get('/',(req,res) => {
    if(!(req.session.user == 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'admin.html'));
})

router.get('/insertP',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'insertP.html'));
})

router.get('/upNotice',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'upNotice.html'));
})

router.get('/delUser',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'delUser.html'));
})

router.post('/insertP',(req,res) => {
    const title = req.body.title;
    let content = req.body.content;
    const answer = req.body.answer;
    const score = req.body.score;
    const file = req.body.file;
    const pType = req.body.pType;
    if(file === ''){
        db.query('insert into Problems (TITLE,CONTENTS,ANSWER,SCORE,PTYPE) values(?,?,?,?,?)',[title,content,answer,score,pType]);
        res.send('<script type="text/javascript">alert("추가완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd/sibal";</script>');
    }
    else{
        db.query('insert into Problems (TITLE,CONTENTS,ANSWER,SCORE,FILE_PATH,PTYPE) values(?,?,?,?,?,?)',[title,content,answer,score,file,pType]);
        res.send('<script type="text/javascript">alert("추가완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd/sibal";</script>');
    }
})

router.post('/upNotice',(req,res) => {
    const title = req.body.title;
    const content = req.body.content;
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    db.query('insert into Notice (TITLE,CONTENTS,TIME) values(?,?,?)',[title,content,time]);
    res.send('<script type="text/javascript">alert("추가완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd";</script>');
})

router.post('/delUser',(req,res) => {
    const user = req.body.user;
    db.query('delete from Users where ID = ?',user,(err,result) => {
        if (err) console.log(err);
        if(!result.affectedRows){
            res.send("<script type='text/javascript'>alert('존재하지 않는 유저입니다.');window.location.href='/tligd/delUser';</script>");
        }
        else{
            db.query('delete from Solved where user = ?',user);
            res.send('<script type="text/javascript">alert("삭제완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd";</script>');
            console.log(user + '의 계정삭제');
        }
    })
})

router.get('/userList',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else{
            db.query('select ID,PROFILE_COMMENT,GRADE from Users',(err,result) => {
            if(err) console.log(err);
            res.render('userList.ejs',{
                users : result
            })
        })
    }
})

router.get('/sibal',(req,res) => {
    db.query('ALTER TABLE Problems AUTO_INCREMENT=1');
    db.query('SET @COUNT = 0');
    db.query('UPDATE Problems SET Problems.ID = @COUNT:=@COUNT+1;');
    res.send('<script type="text/javascript">alert("재정렬 완료");window.location.href="/tligd";</script>');
})

router.get('/deleteP',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'deleteP.html'));
})

router.post('/deleteP',(req,res) => {
    const user = req.body.user;
    db.query('delete from Problems where TITLE = ?',user,(err,result) => {
        if (err) console.log(err);
        if(!result.affectedRows){
            res.send("<script type='text/javascript'>alert('존재하지 않는 유저입니다.');window.location.href='/tligd/deleteP';</script>");
        }
        else{
            res.send('<script type="text/javascript">alert("삭제완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd/sibal";</script>');
            console.log(user + '문제 삭제');
        }
    })
})
.get('/deleteN',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'deleteN.html'));
})
.post('/deleteN',(req,res) =>{
    const title = req.body.user;
    db.query('delete from Notice where TITLE = ?',title,(err,result) => {
        if (err) console.log(err);
        if(!result.affectedRows){
            res.send("<script type='text/javascript'>alert('존재하지 않는 공지입니다.');window.location.href='/tligd/deleteP';</script>");
        }
        else{
            res.send('<script type="text/javascript">alert("삭제완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd/sibal";</script>');
            console.log(req.body.user + ' 공지 삭제');
        }
    })
})
.post('/updateP',(req,res) => {
    const  {
        title,score,content
    } = req.body;
    if(score === '' && content!==''){
        db.query('update Problems set contents=? where title = ?',[content,title],(err,result) =>{
            if(!result.affectedRows){
                res.send("<script type='text/javascript'>alert('존재하지 않는 문제입니다.');window.location.href='/tligd/updateP';</script>");
            }
            else{
                res.send('<script type="text/javascript">alert("삭제완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd/sibal";</script>');
                console.log(title + ' 문제 수정');
            }
        });
    }
    else if(score !== '' && content!==''){
        db.query('select score,id from Problems where title = ?',title,(error,data)=>{
            if(error)
                console.log(err)
            if(!data.length){
                res.send("<script type='text/javascript'>alert('존재하지 않는 문제입니다.');window.location.href='/tligd/deleteP';</script>");
            }
            else{
                db.query('update Users set score=score-? where id in(select user from Solved where pid=?)',[data[0].score-score,data[0].id]);
                db.query('update Problems set score = ?, contents = ? where title = ?',[score,content,title])
                req.session.score -= data[0].score-score;
                req.session.save(() => {
                    res.send('<script type="text/javascript">alert("수정완료!♪(๑ᴖ◡ᴖ๑)♪");window.location.href="/tligd/sibal";</script>');
                    console.log(title + ' 문제 수정');
                })
                }
            }
        )
    }
    else{
        res.send('<script type="text/javascript">alert("값 제대로 넣어");window.location.href="/tligd/updateP";</script>');
    }
})
.get('/updateP',(req,res) => {
    if(!(req.session.user === 'admin'))
        res.send('<script type="text/javascript">alert("관리자가 아니시군요?٩(๑`ȏ´๑)۶");window.location.href="/";</script>');
    else
        res.sendFile(path.join(__dirname,'../views', 'updateP.html'));
})


module.exports = router;