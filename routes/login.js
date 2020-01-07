const express = require('express');
const db = require('../db/connection');
const crypto = require('crypto');
const moment = require('moment');
const router = express.Router();

router.post('/',(req,res)=>{
    const id = req.body.id;
    var tmpPw = req.body.pw;
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const pw = crypto.createHash('sha512').update(tmpPw).digest('base64');
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    db.query('select * from Users where ID = ? and PW = ?' , [id,pw], (err, result) => {
		if (err) throw err;
        if(result.length === 0){
            res.send('<script type="text/javascript">alert("로그인 실패!(# `)3′");window.location.href="/"</script>');
            console.log(time+': '+id + ' 로그인 실패 - '+ip);
        }
        else {
            req.session.flag = result[0].FLAG;
            req.session.user = id;
            req.session.score = result[0].SCORE;
            req.session.school = result[0].SCHOOL;
            req.session.save(() => {
                console.log(time+ ': '+id + ' 로그인 성공 - '+ ip);
                res.send('<script type="text/javascript">alert("로그인 성공!(｡◝‿◜｡)");window.location.href = "/";</script>');
			})
        }  
    })
})

module.exports = router;
