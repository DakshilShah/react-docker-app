// const express = require("express");
// const {classes} = require("../services/class")
// const router = express.Router();

// router.post("/add", async (req, res) => {
// const response = {};
// const data = {};
// const item = req.body;
// try{
//     const addItem = await classes.addItem(item);
//     if(addItem.itemExists){
//         response.success = false;
//         response.itemExists = true;
//         response.error = "Item already added";
//         response.status = "400";
//         return res.status(400).send(response);
//     }else{
//         response.addedItem = addItem;
//         response.success = true;
//         response.status = "200";
//         return res.status(200).send(response);
//     }
// }catch(e){
//     console.log(e);
//     response.success = false;
//     response.error = "Some error occurred. Please try again later";
//     response.status = "500";
//     res.status(500).send(response);
// }
// });