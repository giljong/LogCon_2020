const express = require('express');
const db = require('../db/connection');
const path = require('path');
const router = express.Router();

router.get('/',(req,res) => {
    if(req.query.school === 'high'){
        db.query('select SCORE,SCHOOL,ID,PROFILE_COMMENT from Users where id!="admin" and grade = "고등학생" order by score desc', (err,result) => {
            if (err) throw err;
            if(!(req.session.user === undefined)){
                if(!(req.session.flag))
                    res.redirect('/auth');
                else{
                    res.render('rank',{
                        user_id : req.session.user,
                        user_school : req.session.school,
                        score : req.session.score,
                        users : result
                    })
                }
            }
            else{
                res.render('rank.ejs',{
                    users : result,
                    user_id : 'guest',
                    user_school : 'undefined',
                    score : 0
                });
            }
        });
    }
    else if(req.query.school === 'middle'){
        db.query('select SCORE,SCHOOL,ID,PROFILE_COMMENT from Users where id!="admin" and grade = "중학생" order by score desc', (err,result) => {
            if (err) throw err;
            if(!(req.session.user === undefined)){
                if(!(req.session.flag))
                    res.redirect('/auth');
                else{
                    res.render('rank',{
                        user_id : req.session.user,
                        user_school : req.session.school,
                        score : req.session.score,
                        users : result
                    })
                }
            }
            else{
                res.render('rank.ejs',{
                    users : result,
                    user_id : 'guest',
                    user_school : 'undefined',
                    score : 0
                });
            }
        });
    }
    else{
        db.query('select SCORE,SCHOOL,ID,PROFILE_COMMENT from Users where id!="admin" order by score desc', (err,result) => {
            if (err) throw err;
            if(!(req.session.user === undefined)){
                if(!(req.session.flag))
                    res.redirect('/auth');
                else{
                    res.render('rank',{
                        user_id : req.session.user,
                        user_school : req.session.school,
                        score : req.session.score,
                        users : result
                    })
                }
            }
            else{
                res.render('rank.ejs',{
                    users : result,
                    user_id : 'guest',
                    user_school : 'undefined',
                    score : 0
                });
            }
        });
    }
})

module.exports = router;