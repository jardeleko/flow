const express = require('express')
const app = express()
const route = require('./routes/route')
const PORT = 5000
const path = require ('path');

app.use(route);
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/uploads', express.static(__dirname + 'public/uploads'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('views', './views')
app.set('view engine', 'ejs')



app.listen(PORT, () => {
    console.log('rodando na port http://localhost:5000')
})


/*<% if (message.length > 0) { %>
  <h2><%= message %></h2>
<% } %>
<%={text}%>

*/