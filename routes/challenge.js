const express = require('express');
const db = require('../db/connection');
const moment = require('moment');
const router = express.Router();

router.get('/:num',(req,res) => {
    if(!(req.session === undefined)){
        if(!(req.session.flag))
            res.redirect('/auth');
        else{
            req.session.num = req.params.num;
            db.query('select CONTENTS,TITLE,SCORE,FILE_PATH from Problems where ID = ?',req.session.num,(err,result) => {
                if(err) throw err;
                res.render('challenge.ejs',{
                    info : result,
                    user_id : req.session.user,
                    user_school: req.session.school,
                    pid : req.session.num,
                    score : req.session.score
                 })
            })
        }
    }
    else
        res.redirect('/');
});
router.post('/:num',(req,res) => {
    const ans = req.body.answer;
    console.log(ans);
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    pid = req.session.num;
    if(req.session.user === undefined)
        res.redirect('/');
    else{
        const user = req.session.user;
        db.query('select * from Problems where ID = ?',req.session.num,(err,result) => {
            if(err) throw err;
            if(result[0].ANSWER === ans){
                db.query('select * from Solved where PID = ? and USER = ?',[req.session.num,user],(error,results) => {
                    if(error) console.log(error);
                    if(results.length === 0){
                        console.log(result[0].score,req.session.score)
                        db.query('update Users set SCORE=? where ID = ?',[result[0].SCORE + req.session.score,user]);
                        db.query('insert into Solved (PID,USER) values (?,?)',[req.session.num,user]);
                        req.session.score += result[0].SCORE;
                        req.session.save(() => {
                            res.send('<script type="text/javascript">alert("정답!!!٩(๑❛ワ❛๑)و");window.location.href="/challenges";</script>');
                            console.log(time+': '+user + ' 문제 품' + pid +'번 문제 답: ' + ans+' - '+ip);
                        })
                    }
                    else{
                        res.send('<script type="text/javascript">alert("복습은 아주 좋은거죠 하지만 점수는 없어요ㅎ⁽⁽◝( ˙ ꒳ ˙ )◜⁾⁾");window.location.href="/challenges";</script>');
                        console.log(time+': '+user + ' 문제 또 품' + pid +'번 문제 답: ' + ans+' - '+ip);
                    }
                });
            }
            else{
                res.send('<script type="text/javascript">alert("정답이 아니에요....૮(꒦ິ ˙̫̮ ꒦ິ)ა");window.location.href="/challenges";</script>');
                console.log(time+': '+user + ' 문제 틀림' + pid +'번 문제 답: ' + ans+' - '+ip);
            }
        });
    }
});

router.get('/',(req,res) => {
    if(!(req.session.user === undefined)){
        db.query('select TITLE,SCORE,PTYPE,ID from Problems',(err,result) => {
            if(err) console.log(err);
            db.query('select PID from Solved where USER = ?',req.session.user,(error,data) => {
                if(error) throw error;
                if(!(req.session.user === undefined)){
                    if(!(req.session.flag))
                        res.redirect('/auth');
                    else{
                        res.render('challenges.ejs',{
                            info : result,
                            user_id : req.session.user,
                            user_school: req.session.school,
                            score : req.session.score,
                            solve : data
                        });
                    }
                }
                else
                    res.redirect('/');
            });
        });
    }
    else
        res.redirect('/');
});

module.exports = router;
