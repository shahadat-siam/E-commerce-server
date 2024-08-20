const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// ----- middlewere ------
const corsOption ={
    origin: ["http://localhost:5173","http://localhost:5174"],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOption));
app.use(express.json());



app.get('/', (req, res) => {
    res.send("MS shop server go on the way");
})

app.listen(port, () => {
    console.log(`MS shop is running on port ${port}`);
})